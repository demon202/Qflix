const API_KEY = import.meta.env.VITE_TMDB_API_KEY2;

export const getWatchProviders = async (mediaType, id, userCountry = 'US') => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers?api_key=${API_KEY}`
    );
    const data = await res.json();
    const results = data.results;

    // STREAMING: flatrate or ads/free
    let streamingRegion = userCountry;
    let streaming = results?.[streamingRegion];
    if (!streaming || (!streaming.flatrate && !streaming.ads)) {
      for (const [code, prov] of Object.entries(results)) {
        if (prov.flatrate || prov.ads) {
          streaming = prov;
          streamingRegion = code;
          break;
        }
      }
    }

    // BUY: buy only
    let buyRegion = userCountry;
    let purchase = results?.[buyRegion];
    if (!purchase || !purchase.buy) {
      for (const [code, prov] of Object.entries(results)) {
        if (prov.buy) {
          purchase = prov;
          buyRegion = code;
          break;
        }
      }
    }

    // Return separate objects
    return {
      streaming: {
        flatrate: streaming?.flatrate || [],
        ads: streaming?.ads || [],
        free: streaming?.free || [],
        link: streaming?.link || '',
        region: streamingRegion,
      },
      purchase: {
        buy: purchase?.buy || [],
        link: purchase?.link || '',
        region: buyRegion,
      },
    };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return null;
  }
};
