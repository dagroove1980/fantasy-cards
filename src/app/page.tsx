import Link from 'next/link';
import { Film, Book, ChevronRight } from 'lucide-react';
import { getFantasyMovies } from '@/lib/tmdb';
import { getFantasyBooks } from '@/lib/openlibrary';
import { MovieCard } from '@/components/MovieCard';
import { BookCard } from '@/components/BookCard';

export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const [moviesRes, booksRes] = await Promise.all([
    getFantasyMovies(1),
    getFantasyBooks('fantasy', 1, 8),
  ]);

  const movies = moviesRes.results.slice(0, 8);
  const books = booksRes.docs.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
          Fantasy <span className="text-accent">.cards</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Discover fantasy movies, books, and TV shows. Curated picks with ratings and where to watch.
        </p>
      </section>

      {/* Movies */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Film size={28} className="text-accent" />
            Fantasy Movies
          </h2>
          <Link
            href="/movies"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Book size={28} className="text-accent" />
            Fantasy Books
          </h2>
          <Link
            href="/books"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
