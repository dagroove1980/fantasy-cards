import { Suspense } from 'react';
import { getFantasyTVMultiPage } from '@/lib/tmdb';
import { TVsWithFilters } from '@/components/TVsWithFilters';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Fantasy TV Shows — Browse 100+ Fantasy Series',
  description:
    'Discover the best fantasy TV shows. Game of Thrones, The Witcher, House of the Dragon. Filter by genre, rating, decade.',
  openGraph: {
    title: 'Fantasy TV Shows | FantasyMovies',
    description: 'Browse 100+ fantasy TV series. Filter by genre, rating, decade.',
    url: `${SITE_URL}/tv`,
  },
};

export default async function TVPage() {
  const series = await getFantasyTVMultiPage(5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fantasy TV Shows
        </h1>
        <p className="text-secondary mt-2 max-w-2xl">
          Our curated collection of over 100 fantasy TV series. From Game of Thrones to The Witcher
          and House of the Dragon. Filter by sub-genre, rating, or decade.
        </p>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse bg-card rounded-lg" />}>
        <TVsWithFilters series={series} />
      </Suspense>
    </div>
  );
}
