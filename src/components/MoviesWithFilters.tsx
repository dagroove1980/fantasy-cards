'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/MovieCard';
import { MovieFilters } from '@/components/MovieFilters';
import type { TMDBMovie } from '@/lib/tmdb';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

interface MoviesWithFiltersProps {
  movies: TMDBMovie[];
}

export function MoviesWithFilters({ movies }: MoviesWithFiltersProps) {
  const searchParams = useSearchParams();
  const [showCount, setShowCount] = useState(ITEMS_PER_PAGE);

  const genre = searchParams.get('genre') || '';
  const minRating = searchParams.get('minRating') || '';
  const decade = searchParams.get('decade') || '';

  const filtered = useMemo(() => {
    let result = movies;

    if (genre) {
      const gId = parseInt(genre, 10);
      result = result.filter((m) => m.genre_ids.includes(gId));
    }
    if (minRating) {
      const min = parseFloat(minRating);
      result = result.filter((m) => m.vote_average >= min);
    }
    if (decade) {
      const yearStart = parseInt(decade, 10);
      const yearEnd = yearStart + 9;
      result = result.filter((m) => {
        const y = m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0;
        return y >= yearStart && y <= yearEnd;
      });
    }

    return result;
  }, [movies, genre, minRating, decade]);

  const displayed = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  return (
    <>
      <MovieFilters movies={movies} />
      <p className="text-sm text-secondary mb-6">
        Showing {displayed.length} of {filtered.length} movies
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowCount((n) => n + ITEMS_PER_PAGE)}
            className="px-6 py-3 rounded-lg bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors inline-flex items-center gap-2"
          >
            Load more <ChevronDown size={18} />
          </button>
        </div>
      )}
    </>
  );
}
