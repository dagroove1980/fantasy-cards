import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBookByWorkId, getRelatedBooks, getBookRatings, getAuthorById, coverUrl, workId } from '@/lib/openlibrary';
import { breadcrumbStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';

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
  const [book, related, ratings] = await Promise.all([
    getBookByWorkId(olid),
    getRelatedBooks(olid).catch(() => []),
    getBookRatings(olid).catch(() => null),
  ]);
  if (!book) notFound();

  const firstAuthorKey = book.authors?.[0]?.author?.key?.replace('/authors/', '');
  const firstAuthor = firstAuthorKey
    ? await getAuthorById(firstAuthorKey).catch(() => null)
    : null;

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
            {book.authors && book.authors.length > 0 && (
              <p className="text-secondary mt-2">
                By{' '}
                {book.authors.map((a, i) => {
                  const key = a.author.key.replace('/authors/', '');
                  const author = i === 0 ? firstAuthor : null;
                  const name = author?.name ?? key;
                  return (
                    <span key={key}>
                      {i > 0 && ', '}
                      <Link href={`/authors/${key}`} className="hover:text-accent">
                        {name}
                      </Link>
                    </span>
                  );
                })}
              </p>
            )}
            {book.first_publish_date && (
              <p className="text-secondary mt-1">
                First published: {book.first_publish_date}
              </p>
            )}
            {(ratings?.count ?? 0) > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <Star size={20} className="text-accent fill-accent" />
                <span className="font-semibold">{ratings!.average.toFixed(1)}</span>
                <span className="text-secondary text-sm">({ratings!.count} ratings)</span>
              </div>
            )}
            {book.subjects && book.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {book.subjects.slice(0, 8).map((s) => (
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
            {book.excerpts && book.excerpts.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-card border border-border">
                <p className="text-xs text-secondary uppercase tracking-wide mb-2">Excerpt</p>
                <p className="text-foreground/90 italic">
                  &ldquo;{book.excerpts[0].excerpt?.slice(0, 300)}
                  {book.excerpts[0].excerpt && book.excerpts[0].excerpt.length > 300 ? '…' : ''}&rdquo;
                </p>
              </div>
            )}
            {book.links && book.links.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-secondary uppercase tracking-wide mb-2">Links</p>
                <div className="flex flex-wrap gap-2">
                  {book.links.slice(0, 5).map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      <ExternalLink size={14} />
                      {l.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <p className="text-foreground/80 mt-6 text-sm">
              Discover more fantasy books. Browse by sub-genre, author, or decade.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              More like this
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((b) => {
                const cov = coverUrl(b.cover_i, 'M');
                const bid = workId(b.key);
                const author = b.author_name?.[0] || '';
                const year = b.first_publish_year?.toString() || '';
                return (
                  <Link
                    key={b.key}
                    href={`/books/${bid}`}
                    className="group rounded-[var(--radius-card)] overflow-hidden border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="relative aspect-[2/3] bg-card">
                      {cov ? (
                        <Image
                          src={cov}
                          alt={b.title}
                          fill
                          sizes="150px"
                          className="object-cover object-top group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary text-sm p-2 text-center">
                          {b.title}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="font-heading font-medium text-foreground text-sm line-clamp-2 group-hover:text-accent">
                        {b.title}
                      </h3>
                      <p className="text-xs text-secondary line-clamp-1">
                        {author}
                        {year ? ` (${year})` : ''}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
