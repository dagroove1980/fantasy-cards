import Link from 'next/link';
import Image from 'next/image';
import type { OpenLibraryBook } from '@/lib/openlibrary';
import { coverUrl, workId } from '@/lib/openlibrary';

interface BookCardProps {
  book: OpenLibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  const cover = coverUrl(book.cover_i);
  const id = workId(book.key);
  const author = book.author_name?.[0] || 'Unknown';
  const year = book.first_publish_year?.toString() || '';

  return (
    <article className="rounded-[var(--radius-card)] bg-card overflow-hidden border border-border shadow-[var(--shadow-card)] transition-lift">
      <Link href={`/books/${id}`} className="block">
        <div className="relative aspect-[2/3] bg-card">
          {cover ? (
            <Image
              src={cover}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
              unoptimized={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary text-sm p-4 text-center">
              {book.title}
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/books/${id}`}>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-secondary mt-1 line-clamp-1">
          {author}
          {year ? ` (${year})` : ''}
        </p>
      </div>
    </article>
  );
}
