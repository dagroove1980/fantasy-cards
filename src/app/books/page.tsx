import { getFantasyBooks } from '@/lib/openlibrary';
import { BookCard } from '@/components/BookCard';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Fantasy Books',
  description:
    'Browse fantasy books from our curated collection. Discover epic fantasy, high fantasy, and more.',
  openGraph: {
    title: 'Fantasy Books | Fantasy Cards',
    url: `${SITE_URL}/books`,
  },
};

export default async function BooksPage() {
  const { docs } = await getFantasyBooks('fantasy', 1, 40);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fantasy Books
        </h1>
        <p className="text-secondary mt-2">
          Popular fantasy novels and series. Data from Open Library.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {docs.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </div>
  );
}
