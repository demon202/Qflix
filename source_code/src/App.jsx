import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Search from './components/Search';
import { Spinner } from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './components/appwrite';
import { useRef } from 'react';
import toast from 'react-hot-toast';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL_PRIVATE = import.meta.env.VITE_PRIVATE;
const PRIVATE_MESSAGE = import.meta.env.VITE_PRIVATE_MESSAGE;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heldKey, setHeldKey] = useState(null);
  const [overrideMode, setOverrideMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const [labelOverride, setLabelOverride] = useState(null); // null unless...
  const labels = ['Movies', 'TV Shows', 'Anime'];
  const tapCountRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 600, [searchTerm]);
  
  //fetch weekly trending movies + tv shows
  const fetchMovies = async (query) => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(
        query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/trending/movie/week`,
        API_OPTIONS
      ),
      fetch(
        query
          ? `${API_BASE_URL}/search/tv?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/trending/tv/week`,
        API_OPTIONS
      ),
    ]);

    if (!movieRes.ok && !tvRes.ok) {
      throw new Error('Failed to fetch shows');
    }

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    const movies = (movieData.results || []).map((item) => ({
      ...item,
      media_type: 'movie',
    }));

    const tvShows = (tvData.results || []).map((item) => ({
      ...item,
      media_type: 'tv',
    }));
      //get movies + shows in sorted by popularity(trending)
    const combinedResults = [...movies, ...tvShows].sort(
      (a, b) => b.popularity - a.popularity
    );

    const enrichedResults = await Promise.all(
      combinedResults.map(async (item) => {
        if (item.media_type !== 'movie' && item.media_type !== 'tv' ) return item;

        try {
          const imdbRes = await fetch(
            `${API_BASE_URL}/${item.media_type}/${item.id}/external_ids`,
            API_OPTIONS
          );
          const imdbData = await imdbRes.json();
          return { ...item, imdb_id: imdbData.imdb_id };
        } catch (err) {
          console.error(`Failed to fetch IMDb ID for movie ${item.id}`, err);
          return item;
        }
      })
    );

    setMovieList(enrichedResults);

    if (query && enrichedResults.length > 0) {
      await updateSearchCount(query, enrichedResults[0]);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage('Error fetching results. Please try again later.');
  } finally {
    setIsLoading(false);
  }
};



  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  

  useEffect(() => {
    const handleKeyDown = (e) => setHeldKey(e.key.toLowerCase());
    const handleKeyUp = () => setHeldKey(null);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
    window.scrollTo({ top: 1000, behavior: 'smooth' });
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  

  // mobile L scene
  const handleTitleTap = (e) => {
    setLabelIndex((prevIndex) => (prevIndex + 1) % labels.length);
  e.preventDefault();

  tapCountRef.current += 1;

  if (tapCountRef.current === 6) {
    setLabelOverride('L');
    tapCountRef.current = 0;
    clearTimeout(timerRef.current);
    setOverrideMode(true);
    toast.success(PRIVATE_MESSAGE);
  } else {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500); // reset if not tapped fast enough
  }
};


  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <a href=".">
            <img src="./title.png" alt="Title Logo" />
          </a>
          <h1>
            Find <a href="#" onClick={(e) => e.preventDefault()}>
              <span className={`text-gradient ${labelOverride === 'L' ? 'font-[CloisterBlack]' : ''}`} 
              onClick={handleTitleTap}> {labelOverride || labels[labelIndex]} 
              </span> </a> you will enjoy with no hassle!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Shows people are searching:</h2>
            <ul>
            {trendingMovies.map((movie, index) => {
    const href =
      overrideMode || heldKey === 'l'
        ? `${API_BASE_URL_PRIVATE}/${movie.media_type}/${movie.tmdb_id}`
        : movie.imdb_id
        ? `https://www.imdb.com/title/${movie.imdb_id}`
        : '#';

    return (
      <li key={movie.$id}>
        <p>{index + 1}</p>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <img src={movie.poster_url} alt={movie.title || 'Trending Title'} />
        </a>
      </li>
    );
  })}
</ul>
          </section>
        )}
        <section className="all-movies">
          <h2>Trending this week</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard 
                key={movie.id} 
                movie={movie} 
                heldKey={heldKey} 
                overrideMode={overrideMode}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
    
  );
};

export default App;
