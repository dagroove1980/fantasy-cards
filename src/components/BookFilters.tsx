'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FANTASY_SUBJECTS, subjectLabels } from '@/lib/constants';
import type { OpenLibraryBook } from '@/lib/openlibrary';
import { Filter, X } from 'lucide-react';

const DECADES = [
  { value: '', label: 'Any year' },
  { value: '2020', label: '2020s' },
  { value: '2010', label: '2010s' },
  { value: '2000', label: '2000s' },
  { value: '1990', label: '1990s' },
  { value: '1980', label: '1980s' },
  { value: '1970', label: '1970s' },
];

function getAllAuthorsFromBooks(books: OpenLibraryBook[]): string[] {
  const set = new Set<string>();
  for (const b of books) {
    for (const a of b.author_name || []) {
      if (a.trim()) set.add(a);
    }
  }
  return Array.from(set).sort().slice(0, 30);
}

interface BookFiltersProps {
  books: OpenLibraryBook[];
}

export function BookFilters({ books }: BookFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || '';
  const author = searchParams.get('author') || '';
  const decade = searchParams.get('decade') || '';

  const authors = getAllAuthorsFromBooks(books);
  const hasActive = subject || author || decade;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/books?${params.toString()}`);
  };

  const clearFilters = () => router.push('/books');

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
          <label className="text-xs text-secondary block mb-1">Sub-genre</label>
          <select
            value={subject}
            onChange={(e) => updateFilter('subject', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm min-w-[140px]"
          >
            <option value="">All fantasy</option>
            {FANTASY_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {subjectLabels[s] || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-secondary block mb-1">Author</label>
          <select
            value={author}
            onChange={(e) => updateFilter('author', e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background border border-border text-foreground text-sm min-w-[180px]"
          >
            <option value="">Any author</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
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
      </div>
    </div>
  );
}
