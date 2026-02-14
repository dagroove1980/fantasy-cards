import { TMDB_FANTASY_GENRE_ID } from './constants';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set');
  return key;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_title?: string;
  popularity?: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
}

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export function posterUrl(path: string | null, size: 'w200' | 'w300' | 'w500' = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

async function tmdbFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const key = getApiKey();
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // 1 hour
  });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

/** Fetch fantasy movies (genre 14) */
export async function getFantasyMovies(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return tmdbFetch('/discover/movie', {
    with_genres: TMDB_FANTASY_GENRE_ID,
    sort_by: 'popularity.desc',
    page,
  });
}

/** Fetch multiple pages of fantasy movies for larger catalog */
export async function getFantasyMoviesMultiPage(pages = 10): Promise<TMDBMovie[]> {
  const all: TMDBMovie[] = [];
  const seen = new Set<number>();

  for (let p = 1; p <= pages; p++) {
    const res = await getFantasyMovies(p);
    for (const m of res.results) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        all.push(m);
      }
    }
    if (p >= res.total_pages) break;
  }

  return all;
}

/** Fetch fantasy movies with optional API-level filters */
export async function getFantasyMoviesFiltered(options: {
  genreIds?: number[];
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  page?: number;
}): Promise<TMDBSearchResponse<TMDBMovie>> {
  const params: Record<string, string | number> = {
    with_genres: options.genreIds?.length
      ? options.genreIds.join(',')
      : TMDB_FANTASY_GENRE_ID,
    sort_by: 'popularity.desc',
    page: options.page ?? 1,
  };
  if (options.yearFrom)
    params['primary_release_date.gte'] = `${options.yearFrom}-01-01`;
  if (options.yearTo)
    params['primary_release_date.lte'] = `${options.yearTo}-12-31`;
  if (options.minRating != null) params['vote_average.gte'] = options.minRating;
  return tmdbFetch('/discover/movie', params);
}

/** Fetch single movie by ID */
export async function getMovieById(id: string): Promise<TMDBMovieDetail | null> {
  try {
    return await tmdbFetch<TMDBMovieDetail>(`/movie/${id}`);
  } catch {
    return null;
  }
}

/** Search movies */
export async function searchMovies(query: string, page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return tmdbFetch('/search/movie', { query, page });
}

/** Fetch fantasy TV shows */
export async function getFantasyTV(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  return tmdbFetch('/discover/tv', {
    with_genres: TMDB_FANTASY_GENRE_ID,
    sort_by: 'popularity.desc',
    page,
  });
}
