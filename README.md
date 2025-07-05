# 🎬 Qflix

**Qflix** is a sleek and dynamic movie and TV show search app built with React and powered by The Movie Database (TMDb) API. It allows users to search for trending content, explore top-rated titles, and view metadata-rich cards linking to streaming and IMDb sources.

### 🌐 Live Demo
👉 [Visit Qflix](https://demon202.github.io/Qflix)  

---

## 📌 Features

- 🔍 **Live Search**: Instantly search for movies and TV shows
- 📈 **Trending Section**: Displays most searched items across all users
- 🎞️ **Detailed Movie Cards**: Displays poster, rating, release year, and language
- 🎯 **Interactive Links**: Click to view IMDb
- 🧠 **Search Intelligence**: Backed by Appwrite to track what users search most
- 📊 **Custom Trending Algorithm**: Combines multiple queries pointing to the same content

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, JavaScript (ES6+)
- **API**: TMDb API for movie/TV data
- **Backend**: Appwrite (Database, Serverless Functions)
- **Hosting**: GitHub Pages (or any modern static hosting)

---

## 🙌 Credits 
- **TMDb** — for the movie/TV data API

- **Appwrite** — backend services and database

---

## 🔥Devlog

## 📦 Version 1.3.0 – Seamless YouTube Trailer Previews

This release brings smart, performant trailer previews using the YouTube Iframe API — optimized for both desktop and mobile users.

### ✨ Features

- **Autoplay YouTube Trailers**
  - Automatically plays trailers on hover (desktop).
  - On mobile, trailers autoplay after 3 seconds in view (using `IntersectionObserver`).
  
- **Mute/Unmute Toggle**
  - Seamlessly toggles mute without interrupting video playback (no buffering or reload).
  - Built with the official [YouTube Iframe API](https://developers.google.com/youtube/iframe_api_reference).

- **Thumbnail Fallback**
  - Displays a static trailer thumbnail (`mqdefault.jpg`) if autoplay fails or trailer is unavailable.

- **Mobile-First Optimizations**
  - Prevents autoplay on scroll — plays only when the trailer card is fully in view.
  - Reduces unnecessary bandwidth usage and improves UX.

-  **Smart Defaults**
  - Resets to muted state on hover-out.
  - Clicking the mute button does **not** trigger navigation (e.g., `a` tags).

---

> Intention: Trailers fall back in restricted regions where autoplay is blocked, so UX remains smooth.


### v1.2.1
- **Release Date** – Displays accurate release dates (in dd-mm-yyyy format) on posters for upcoming movies.

### v1.2.0
- **Thumbnail** – Added movie thumbnail preview on hover. Autoplay trailer not implemented due to YouTube sign-in requirements in some regions (Update as of June 2025).


### v1.1.0
- **PWA** – Converted the web app to a Progressive Web App (PWA) using Vite.
- **Retailers** – Integrated region-specific provider listings using browser language.

### v1.0.0
- Initial release with core search, display, and rating features.