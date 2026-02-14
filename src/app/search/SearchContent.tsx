'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { BookCard } from '@/components/BookCard';
import type { TMDBMovie } from '@/lib/tmdb';
import type { OpenLibraryBook } from '@/lib/openlibrary';

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    movies: TMDBMovie[];
    books: OpenLibraryBook[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=all`
      ).then((r) => r.json());
      setResults({
        movies: res.results || [],
        books: res.docs || [],
      });
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">
        Search
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies and books..."
            className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 rounded-lg bg-accent text-background font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <SearchIcon size={20} />
            )}
            Search
          </button>
        </div>
      </form>

      {results && (
        <>
          {results.movies.length > 0 && (
            <section className="mb-12">
              <h2 className="font-heading text-xl font-bold mb-4">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.movies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          )}
          {results.books.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-bold mb-4">Books</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.books.map((b) => (
                  <BookCard key={b.key} book={b} />
                ))}
              </div>
            </section>
          )}
          {results.movies.length === 0 && results.books.length === 0 && (
            <p className="text-secondary">
              No results found for &quot;{query}&quot;
            </p>
          )}
        </>
      )}

      {!results && !initialQuery && (
        <p className="text-secondary">
          Enter a search term to find movies and books.
        </p>
      )}
    </div>
  );
}
