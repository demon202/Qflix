import React, { useState, useEffect } from 'react';
import { getWatchProviders } from './getWatchProviders';
import { countryNames } from './countryNames';
import { getAvailabilityStatus } from './getAvailabilityStatus';


const API_BASE_URL_PRIVATE = import.meta.env.VITE_PRIVATE;

const MovieCard = ({
  movie: {
    id,
    title,
    name,
    vote_average,
    poster_path,
    release_date,
    first_air_date,
    original_language,
    imdb_id,
    media_type,
  },
  heldKey,
  overrideMode,
}) => {
  // Streaming state
  const [flatrateProviders, setFlatrateProviders] = useState([]);
  const [adsProviders, setAdsProviders] = useState([]);
  const [freeProviders, setFreeProviders] = useState([]);
  const [streamingRegion, setStreamingRegion] = useState(null);
  const [streamingLink, setStreamingLink] = useState(null);

  // Buy state
  const [buyProviders, setBuyProviders] = useState([]);
  const [buyRegion, setBuyRegion] = useState(null);
  const [buyLink, setBuyLink] = useState(null);

  //get user country code robustly
  const getUserCountryCode = () => {
  try {
    const locale = new Intl.Locale(navigator.language || 'en-US');
    return locale.region || 'US';
  } catch {
    return 'US';
  }
};
  //flag emoji
  const getFlagSVG = (countryCode, size = "w160") =>
    `https://flagcdn.com/${size}/${countryCode.toLowerCase()}.png`;


  // Fallback message
  const releaseDate = release_date || first_air_date;
  const hasAnyProvider =
    flatrateProviders.length > 0 ||
    adsProviders.length > 0 ||
    freeProviders.length > 0 ||
    buyProviders.length > 0;
  const fallbackMessage = getAvailabilityStatus(releaseDate, hasAnyProvider);

  useEffect(() => {
    const fetchProviders = async () => {
      const userLang = navigator.language || 'en-US';
      const countryCode = getUserCountryCode();

      const result = await getWatchProviders(media_type, id, countryCode);
      if (result) {
        const { streaming, purchase } = result;

        // streaming
        setFlatrateProviders(streaming.flatrate || []);
        setAdsProviders(streaming.ads || []);
        setFreeProviders(streaming.free || []);
        setStreamingLink(streaming.link);
        setStreamingRegion(streaming.region || countryCode);

        // buy
        setBuyProviders(purchase.buy || []);
        setBuyLink(purchase.link);
        setBuyRegion(purchase.region || countryCode);
      }
    };

    fetchProviders();
  }, [id, media_type]);

  const href =
    overrideMode || heldKey === 'l'
      ? `${API_BASE_URL_PRIVATE}/${media_type}/${id}`
      : imdb_id
      ? `https://www.imdb.com/title/${imdb_id}`
      : '#';

  const renderProviders = (providers, link) =>
    providers.map((prov) => (
      <a
        key={prov.provider_id}
        href={link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        title={prov.provider_name}
      >
        <img
          src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
          alt={prov.provider_name}
          style={{
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            borderRadius: '6px',
          }}
        />
      </a>
    ));

  return (
    <div className="movie-card">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : 'no-movie.png'
          }
          alt={title}
        />
      </a>
      <div className="mt-4">
        <h3>{title || name}</h3>
        <div className="content">
          <p className="lang">{media_type === 'tv' ? 'TV' : 'Movie'}</p>
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {(release_date || first_air_date || 'N/A').split('-')[0]}
          </p>

          <div className="w-full">
            {/* Streaming */}
            {(flatrateProviders.length > 0 || adsProviders.length > 0) && (
              <div className="mt-2">
                {streamingRegion?.length === 2 && (
                <h3 className="inline-flex items-center gap-1">
                  Stream:{' '}
            <span className="inline-flex items-center gap-1" title={countryNames[streamingRegion]}>
              <img
                src={getFlagSVG(streamingRegion)}
                alt={streamingRegion}
                className="inline-block w-5 h-4 object-cover rounded-sm"
              /> ({streamingRegion})
            </span>
                </h3>
                )}
                <div className="flex gap-2 mt-1">
                  {renderProviders(flatrateProviders, streamingLink)}
                </div>
                 {(adsProviders.length > 0 || freeProviders.length > 0) && (
              <div className="mt-2">
                <span>Legally Free with ads:</span>
                <div className="flex gap-2 mt-1">
                  {renderProviders([...freeProviders, ...adsProviders], streamingLink)}
                </div>
              </div>
            )}
              </div>
            )}

            {/* Buy */}
            {buyProviders.length > 0 && (
              <div className="mt-2">
                <h3 className="inline-flex items-center gap-1">
                  Buy or Rent:{' '}
                  <span className="inline-flex items-center gap-1" title={countryNames[buyRegion]}>
                      <img
                        src={getFlagSVG(buyRegion)}
                        alt={buyRegion}
                        className="inline-block w-5 h-4 object-cover rounded-sm"
                      />
                      ({buyRegion})
                      </span>
                  </h3>
                <div className="flex gap-2 mt-1">
                  {renderProviders(buyProviders, buyLink)}
                </div>
              </div>
            )}

            {/* Fallback message */}
            {flatrateProviders.length === 0 &&
              adsProviders.length === 0 &&
              buyProviders.length === 0 && (
                <div>
                  <h3 className="w-full mt-2 text-gray-400">
                    {fallbackMessage}
                  </h3>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
