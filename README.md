# Fantasy Cards

Fantasy movies, books, and TV shows — curated from TMDB and Open Library.

**URL:** https://www.fantasy-cards.vercel.app

## Features

- **Movies** — Fantasy films from TMDB with posters, ratings, release dates
- **Books** — Fantasy novels from Open Library with covers and authors
- **Search** — Combined search across movies and books
- **SEO** — Sitemap, robots, structured data (Movie, Book schema), breadcrumbs

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))
3. Run `npm install` and `npm run dev`

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel, name the project `fantasy-cards`
3. Add environment variable: `TMDB_API_KEY`
4. For custom domain `www.fantasy-cards.vercel.app`, add it in Vercel project settings

## Data Sources

- **TMDB** — Movies and TV (requires free API key)
- **Open Library** — Books (no key required)
