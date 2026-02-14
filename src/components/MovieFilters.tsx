'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { genreLabels } from '@/lib/constants';
import type { TMDBMovie } from '@/lib/tmdb';
import { Filter, X } from 'lucide-react';

const RATING_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: '6', label: '6+ stars' },
  { value: '7', label: '7+ stars' },
  { value: '8', label: '8+ stars' },
];

const DECADES = [
  { value: '', label: 'Any year' },
  { value: '2020', label: '2020s' },
  { value: '2010', label: '2010s' },
  { value: '2000', label: '2000s' },
  { value: '1990', label: '1990s' },
  { value: '1980', label: '1980s' },
];

function getAllGenresFromMovies(movies: TMDBMovie[]): number[] {
  const set = new Set<number>();
  for (const m of movies) {
    for (const g of m.genre_ids) {
      if (genreLabels[g]) set.add(g);
    }
  }
  return Array.from(set).sort();
}

interface MovieFiltersProps {
  movies: TMDBMovie[];
}

export function MovieFilters({ movies }: MovieFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genre = searchParams.get('genre') || '';
  const minRating = searchParams.get('minRating') || '';
  const decade = searchParams.get('decade') || '';
  const sort = searchParams.get('sort') || 'popularity';

  const genres = getAllGenresFromMovies(movies);
  const hasActive = genre || minRating || decade;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/movies?${params.toString()}`);
  };

  const clearFilters = () => router.push('/movies');

  return (
    <div className="mb-8 p-4 rounded-lg bg-card border border-border">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Filter size={18} className="text-accent" />
        <span className="text-sm font-medium text-foreground">Filters</span>
        {hasActive && (
          <button
            onClick={clearFilters}
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-secondary block mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => updateFilter('genre', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm"
          >
            <option value="">All fantasy sub-genres</option>
            {genres.map((id) => (
              <option key={id} value={id}>
                {genreLabels[id]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1">Rating</label>
          <select
            value={minRating}
            onChange={(e) => updateFilter('minRating', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm"
          >
            {RATING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1">Decade</label>
          <select
            value={decade}
            onChange={(e) => updateFilter('decade', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm"
          >
            {DECADES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1">Sort by</label>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="year">Year (newest)</option>
            <option value="year-asc">Year (oldest)</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
