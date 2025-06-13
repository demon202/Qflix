import {Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID= import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID= import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID= import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, item) => {
  try {
    //check if poster is available or item id is valid
    if (!item.poster_path || !item.id) {
      console.warn('Skipped database count update: No poster available.');
      return;
    }
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    const payload = {
  searchTerm,
  count: 1,
  poster_url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
};

if (item.media_type === 'movie') {
  payload.movie_id = item.id;
  payload.media_type = 'movie';
  payload.tmdb_id = item.id;
} else if (item.media_type === 'tv') {
  payload.tv_id = item.id;
  payload.media_type = 'tv';
  payload.tmdb_id = item.id;
}

if (item.imdb_id) {
  payload.imdb_id = item.imdb_id;
}
console.log('Payload to Appwrite:', payload);


    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
    }
  } catch (error) {
    console.log(error);
  }
};


export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100), // Increase this if needed to get a meaningful sample
    ]);

    const countsMap = {};

    for (const doc of result.documents) {
      const key = doc.movie_id || doc.tv_id;

      if (!key) continue;

      if (!countsMap[key]) {
        countsMap[key] = {
          ...doc,
          count: 0,
        };
      }

      countsMap[key].count += doc.count;
    }

    // Convert to array and sort by count descending
    const sorted = Object.values(countsMap).sort((a, b) => b.count - a.count);

    // Limit to top 5
    return sorted.slice(0, 5).map((doc) => ({
  ...doc,
  media_type: doc.media_type,
  tmdb_id: doc.tmdb_id || doc.movie_id || doc.tv_id,
  imdb_id: doc.imdb_id,
}));
  } catch (error) {
    console.log(error);
    return [];
  }
};

