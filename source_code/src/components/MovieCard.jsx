import React, { useState, useEffect, useRef } from 'react';



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
  overrideMode, // new prop to control vidbox override
}) => {
  // Decide link based on heldKey or fallback imdb link
  const href = overrideMode || heldKey === 'l'
      ? `https://vidbox.to/${media_type}/${id}`
      : imdb_id
      ? `https://www.imdb.com/title/${imdb_id}`
      : '#';

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
        <h3>
            {title || name}
        </h3>
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
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
