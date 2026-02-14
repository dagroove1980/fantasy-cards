import { Suspense } from 'react';
import { getFantasyBooksMultiSubject } from '@/lib/openlibrary';
import { BooksWithFilters } from '@/components/BooksWithFilters';
import { FANTASY_SUBJECTS } from '@/lib/constants';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Fantasy Books — Browse 200+ Fantasy Novels',
  description:
    'Explore the best fantasy books and series. Filter by sub-genre (epic fantasy, dark fantasy, urban fantasy), author, or publication decade. Find your next favorite fantasy novel.',
  openGraph: {
    title: 'Fantasy Books | Fantasy Cards',
    description: 'Browse 200+ fantasy novels. Filter by author, sub-genre, decade. Epic fantasy, dark fantasy, and more.',
    url: `${SITE_URL}/books`,
  },
};

export default async function BooksPage() {
  const books = await getFantasyBooksMultiSubject([...FANTASY_SUBJECTS], 35);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fantasy Books
        </h1>
        <p className="text-secondary mt-2 max-w-2xl">
          A curated collection of over 200 fantasy novels from epic fantasy to urban fantasy. 
          Discover works by Brandon Sanderson, George R.R. Martin, and more. Filter by sub-genre, 
          author, or decade to find your next read.
        </p>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse bg-card rounded-lg" />}>
        <BooksWithFilters books={books} />
      </Suspense>
    </div>
  );
}
