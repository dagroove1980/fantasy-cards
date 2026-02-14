'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookCard } from '@/components/BookCard';
import { BookFilters } from '@/components/BookFilters';
import type { OpenLibraryBook } from '@/lib/openlibrary';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

interface BooksWithFiltersProps {
  books: OpenLibraryBook[];
}

export function BooksWithFilters({ books }: BooksWithFiltersProps) {
  const searchParams = useSearchParams();
  const [showCount, setShowCount] = useState(ITEMS_PER_PAGE);

  const subject = searchParams.get('subject') || '';
  const author = searchParams.get('author') || '';
  const decade = searchParams.get('decade') || '';

  const filtered = useMemo(() => {
    let result = books;

    if (subject) {
      const key = subject.replace(/_/g, ' ').toLowerCase();
      result = result.filter((b) =>
        b.subject?.some((s) => s.toLowerCase().includes(key))
      );
    }
    if (author) {
      result = result.filter((b) =>
        b.author_name?.some((a) => a === author)
      );
    }
    if (decade) {
      const yearStart = parseInt(decade, 10);
      const yearEnd = yearStart + 9;
      result = result.filter((b) => {
        const y = b.first_publish_year ?? 0;
        return y >= yearStart && y <= yearEnd;
      });
    }

    return result;
  }, [books, subject, author, decade]);

  const displayed = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  return (
    <>
      <BookFilters books={books} />
      <p className="text-sm text-secondary mb-6">
        Showing {displayed.length} of {filtered.length} books
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((b) => (
          <BookCard key={b.key} book={b} />
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
