export const SITE_NAME = 'Fantasy Cards';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://fantasy-cards.vercel.app');
export const SITE_DESCRIPTION =
  'Discover fantasy movies, books, and TV shows. Curated picks with ratings, trailers, and where to watch.';

// TMDB Fantasy genre ID
export const TMDB_FANTASY_GENRE_ID = 14;

// Fantasy sub-genres for books (Open Library subjects)
export const FANTASY_SUBJECTS = [
  'fantasy',
  'high_fantasy',
  'epic_fantasy',
  'dark_fantasy',
  'urban_fantasy',
  'fantasy_fiction',
] as const;

export const subjectLabels: Record<string, string> = {
  fantasy: 'Fantasy',
  high_fantasy: 'High Fantasy',
  epic_fantasy: 'Epic Fantasy',
  dark_fantasy: 'Dark Fantasy',
  urban_fantasy: 'Urban Fantasy',
  fantasy_fiction: 'Fantasy Fiction',
};

// TMDB genre labels
export const genreLabels: Record<number, string> = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy',
  10770: 'TV Movie',
};
