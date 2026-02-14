import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBookByWorkId } from '@/lib/openlibrary';
import { coverUrl } from '@/lib/openlibrary';
import { bookMetaTitle, bookMetaDescription, bookStructuredData, breadcrumbStructuredData } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ olid: string }>;
}

export async function generateStaticParams() {
  const { getFantasyBooksMultiSubject, workId } = await import('@/lib/openlibrary');
  const books = await getFantasyBooksMultiSubject(
    ['fantasy', 'high_fantasy', 'epic_fantasy'],
    90
  );
  return books.slice(0, 250).map((b) => ({ olid: workId(b.key) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { olid } = await params;
  const book = await getBookByWorkId(olid);
  if (!book) return {};

  return {
    title: `${book.title} — Fantasy Book`,
    description: book.description?.slice(0, 160) || `Fantasy book: ${book.title}`,
    openGraph: {
      title: book.title,
      url: `/books/${olid}`,
      type: 'article',
      images: book.covers?.[0]
        ? [{ url: `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` }]
        : [],
    },
    alternates: { canonical: `/books/${olid}` },
  };
}

export default async function BookPage({ params }: Props) {
  const { olid } = await params;
  const book = await getBookByWorkId(olid);
  if (!book) notFound();

  const cover = book.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    datePublished: book.first_publish_date,
    image: cover,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbStructuredData([
              { name: 'Home', url: '/' },
              { name: 'Books', url: '/books' },
              { name: book.title, url: `/books/${olid}` },
            ])
          ),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-accent mb-6"
        >
          <ArrowLeft size={16} />
          Back to books
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {cover && (
            <div className="relative w-full md:w-48 shrink-0 aspect-[2/3] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <Image
                src={cover}
                alt={book.title}
                fill
                className="object-cover object-top"
                priority
                sizes="192px"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {book.title}
            </h1>
            {book.first_publish_date && (
              <p className="text-secondary mt-2">
                First published: {book.first_publish_date}
              </p>
            )}
            {book.subjects && book.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {book.subjects.slice(0, 6).map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded-md bg-border text-secondary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {book.description && (
              <p className="text-foreground/90 mt-6 leading-relaxed">
                {book.description}
              </p>
            )}
            <p className="text-foreground/80 mt-6 text-sm">
              Discover more fantasy books. Browse by sub-genre, author, or decade.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
