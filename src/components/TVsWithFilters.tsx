'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TVCard } from '@/components/TVCard';
import { TVFilters } from '@/components/TVFilters';
import type { TMDBSeries } from '@/lib/tmdb';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

interface TVsWithFiltersProps {
  series: TMDBSeries[];
}

export function TVsWithFilters({ series }: TVsWithFiltersProps) {
  const searchParams = useSearchParams();
  const [showCount, setShowCount] = useState(ITEMS_PER_PAGE);

  const genre = searchParams.get('genre') || '';
  const minRating = searchParams.get('minRating') || '';
  const decade = searchParams.get('decade') || '';
  const sort = searchParams.get('sort') || 'popularity';

  const filtered = useMemo(() => {
    let result = series;

    if (genre) {
      const gId = parseInt(genre, 10);
      result = result.filter((s) => s.genre_ids.includes(gId));
    }
    if (minRating) {
      const min = parseFloat(minRating);
      result = result.filter((s) => s.vote_average >= min);
    }
    if (decade) {
      const yearStart = parseInt(decade, 10);
      const yearEnd = yearStart + 9;
      result = result.filter((s) => {
        const y = s.first_air_date
          ? parseInt(s.first_air_date.slice(0, 4), 10)
          : 0;
        return y >= yearStart && y <= yearEnd;
      });
    }

    const sorted = [...result];
    switch (sort) {
      case 'rating':
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'year':
        sorted.sort((a, b) => (b.first_air_date || '').localeCompare(a.first_air_date || ''));
        break;
      case 'year-asc':
        sorted.sort((a, b) => (a.first_air_date || '').localeCompare(b.first_air_date || ''));
        break;
      case 'title':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [series, genre, minRating, decade, sort]);

  const displayed = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  return (
    <>
      <TVFilters series={series} />
      <p className="text-sm text-secondary mb-6">
        Showing {displayed.length} of {filtered.length} shows
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((s) => (
          <TVCard key={s.id} series={s} />
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
