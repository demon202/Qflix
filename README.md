# Qflix

**Qflix** is a sleek and dynamic movie and TV show search app built with React and powered by The Movie Database (TMDb) API. It allows users to search for trending content, explore top-rated titles, and view metadata-rich cards linking to streaming and IMDb sources.

### Live Demo  
[Visit Qflix](https://demon202.github.io/Qflix)

---

## Features

- **Live Search** – Instantly search for movies and TV shows.  
- **Trending Section** – Displays the most searched and trending titles across all users.  
- **Detailed Movie Cards** – Show poster, rating, release year, and language.  
- **Interactive Links** – Quick access to IMDb or TMDb pages.  
- **Search Intelligence** – Backed by Appwrite to track and analyze search trends.  
- **Custom Trending Algorithm** – Combines user search data to determine popularity.  

---

## Tech Stack

- **Frontend:** React, Vite, JavaScript (ES6+)  
- **API:** TMDb API for movie/TV data  
- **Backend:** Appwrite (Database, Serverless Functions)  
- **Hosting:** GitHub Pages (or any modern static hosting)

---

## Credits  

- **TMDb** — for the movie/TV data API  
- **Appwrite** — for backend services and database  

---

## Devlog

### Version 2.0 – Genre Selector and Smart Trending Toggle

This release focuses on refining user control and modernizing the homepage layout for a cleaner, more interactive experience.

#### New Features

- **Genre Filter Dropdown**  
  - A new “Genre” button placed directly inside the search bar.  
  - Clicking it reveals a full-width dropdown that blends with the site’s aesthetic background.  
  - Smooth slide-down animation with blur and transparency for a premium visual experience.  
  - Clicking the button again retracts the genre list and restores the default trending layout.  

- **Trending Toggle (Monthly vs. Popular Searches)**  
  - A reimagined modern toggle button allows users to switch between “Monthly Trending” and “Popular Searches.”  
  - Responsive and consistent across all screen sizes with balanced alignment.  
  - Smooth transitions, fluid motion, and adaptive color themes matching the site’s tone.  

#### Design Improvements

- Subtle transitions for improved responsiveness.  
- Visual consistency across mobile and desktop devices.  
- Enhanced user experience by hiding “Trending This Month” when searching or browsing genres.  

---

### Version 1.3.0 – Seamless YouTube Trailer Previews

This release introduced smart, performant trailer previews using the YouTube Iframe API — optimized for both desktop and mobile users.

#### Features

- **Autoplay YouTube Trailers**  
  - Automatically plays trailers on hover (desktop).  
  - On mobile, trailers autoplay after 3 seconds in view using `IntersectionObserver`.  

- **Mute/Unmute Toggle**  
  - Mutes and unmutes without reloading or buffering.  
  - Built with the official [YouTube Iframe API](https://developers.google.com/youtube/iframe_api_reference).  

- **Thumbnail Fallback**  
  - Displays static thumbnails if autoplay fails or the trailer is unavailable.  

- **Mobile Optimizations**  
  - Prevents autoplay on scroll and reduces bandwidth usage.  

- **Smart Defaults**  
  - Resets mute state automatically after hover.  

> Designed to maintain a smooth user experience even in regions where autoplay is restricted.

---

### Version 1.2.1  
- Added accurate release dates (dd-mm-yyyy) for upcoming movies.

### Version 1.2.0  
- Introduced movie thumbnail previews on hover.  

### Version 1.1.0  
- Converted the app to a PWA using Vite.  
- Added region-specific streaming provider listings.  

### Version 1.0.0  
- Initial release with core search, display, and rating features.
