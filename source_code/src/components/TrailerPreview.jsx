import React, { useState, useEffect } from 'react';

const TrailerPreview = ({ mediaType, id, posterPath, fallbackHref }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerURL, setTrailerURL] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY2}`
        );
        const data = await res.json();
        const trailer = data.results?.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
          setTrailerURL(`https://www.themoviedb.org/${mediaType}/${id}/video/${trailer.key}`);
        }
      } catch (err) {
        console.error('Failed to fetch trailer:', err);
      }
    };
    fetchTrailer();
  }, [mediaType, id]);

  const posterSrc = posterPath
    ? `https://image.tmdb.org/t/p/w500/${posterPath}`
    : 'no-movie.png';

  const thumbnailSrc = trailerKey
    ? `https://img.youtube.com/vi/${trailerKey}/mqdefault.jpg`
    : null;

  return (
    <a
      href={fallbackHref || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: '2 / 3',
        backgroundColor: 'black',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Poster Image */}
      <img
        src={posterSrc}
        alt="Movie Poster"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out',
          opacity: isHovered && thumbnailSrc ? 0 : 1,
          filter: isHovered ? 'brightness(0.7)' : 'none',
        }}
      />

      {/* Trailer Thumbnail if available */}
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt="Trailer Thumbnail"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease-in-out',
            opacity: isHovered ? 0.7 : 0,
          }}
        />
      )}

      {/* Always show play icon on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
            color: 'white',
            pointerEvents: 'none',
            textShadow: '0 0 10px black',
          }}
        >
          ▶
        </div>
      )}
    </a>
  );
};

export default TrailerPreview;
