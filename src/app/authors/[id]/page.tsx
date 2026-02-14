import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthorById, getAuthorWorks, coverUrl, workId } from '@/lib/openlibrary';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) return {};

  return {
    title: `${author.name} — Fantasy Author`,
    description: author.bio?.slice(0, 160) || `Books by ${author.name}`,
    alternates: { canonical: `/authors/${id}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const [author, works] = await Promise.all([
    getAuthorById(id),
    getAuthorWorks(id, 24).catch(() => []),
  ]);
  if (!author) notFound();

  const photo = author.photos?.[0]
    ? `https://covers.openlibrary.org/a/olid/${id}-M.jpg`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-1 text-sm text-secondary hover:text-accent mb-6"
      >
        <ArrowLeft size={16} />
        Back to books
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {photo && (
          <div className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden border border-border">
            <Image
              src={photo}
              alt={author.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {author.name}
          </h1>
          {(author.birth_date || author.death_date) && (
            <p className="text-secondary mt-2">
              {author.birth_date}
              {author.death_date ? ` – ${author.death_date}` : ''}
            </p>
          )}
          {author.bio && (
            <p className="text-foreground/90 mt-4 leading-relaxed">
              {author.bio}
            </p>
          )}
          {author.links && author.links.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {author.links.slice(0, 5).map((l) => (
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
          )}
        </div>
      </div>

      {works.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
            Works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {works.map((b) => {
              const cov = coverUrl(b.cover_i, 'M');
              const bid = workId(b.key);
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
                    <p className="text-xs text-secondary">{year}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
