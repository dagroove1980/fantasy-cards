import { Suspense } from 'react';
import { getFantasyMoviesMultiPage } from '@/lib/tmdb';
import { MoviesWithFilters } from '@/components/MoviesWithFilters';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Fantasy Movies — Browse 200+ Fantasy Films',
  description:
    'Discover the best fantasy movies of all time. Over 200 films. Filter by genre, rating, and decade. From epic adventures to dark fantasy, find your next favorite film.',
  openGraph: {
    title: 'Fantasy Movies | FantasyMovies',
    description: 'Browse 200+ fantasy films. Filter by genre, rating, decade. Epic adventures, dark fantasy, and more.',
    url: `${SITE_URL}/movies`,
  },
};

export default async function MoviesPage() {
  const movies = await getFantasyMoviesMultiPage(10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fantasy Movies
        </h1>
        <p className="text-secondary mt-2 max-w-2xl">
          Our curated collection of over 200 fantasy films. From Lord of the Rings to Avatar, 
          discover epic adventures, dark fantasy, and magical worlds. Filter by sub-genre, 
          audience rating, or decade to find the perfect movie for your next watch.
        </p>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse bg-card rounded-lg" />}>
        <MoviesWithFilters movies={movies} />
      </Suspense>
    </div>
  );
}
