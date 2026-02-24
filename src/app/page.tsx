import Link from 'next/link';
import { Film, Book, Tv, ChevronRight } from 'lucide-react';
import { getFantasyMovies, getFantasyTV } from '@/lib/tmdb';
import { getFantasyBooks } from '@/lib/openlibrary';
import { MovieCard } from '@/components/MovieCard';
import { BookCard } from '@/components/BookCard';
import { TVCard } from '@/components/TVCard';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';

export const revalidate = 3600; // 1 hour

export const metadata = {
  title: 'FantasyMovies — Fantasy Movies, Books & TV Shows',
  description:
    'Discover the best fantasy movies, books, and TV shows. 200+ films, 275+ novels. Filter by genre, author, rating, decade. Find your next fantasy obsession.',
  openGraph: {
    title: `${SITE_NAME} — Fantasy Movies, Books & TV`,
    url: SITE_URL,
  },
};

export default async function HomePage() {
  const [moviesRes, booksRes, tvRes] = await Promise.all([
    getFantasyMovies(1),
    getFantasyBooks('fantasy', 1, 8),
    getFantasyTV(1),
  ]);

  const movies = moviesRes.results.slice(0, 12);
  const books = booksRes.docs.slice(0, 8);
  const series = tvRes.results.slice(0, 8);

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
            Fantasy<span className="text-accent">Movies</span>
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-6">
            Discover the best fantasy movies, books, and TV shows. Curated picks with ratings,
            filters, and search. Over 200 films and 275+ novels to explore.
          </p>
          <p className="text-sm text-secondary/80 max-w-xl mx-auto">
            From epic fantasy films like Lord of the Rings to beloved book series by Brandon Sanderson and George R.R. Martin.
            Filter by genre, author, decade, or rating to find exactly what you&apos;re looking for.
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

        {/* TV Shows */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Tv size={28} className="text-accent" />
              Fantasy TV Shows
            </h2>
            <Link
              href="/tv"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {series.map((s) => (
              <TVCard key={s.id} series={s} />
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
    </>
  );
}
