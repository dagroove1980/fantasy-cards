import Link from 'next/link';
import Image from 'next/image';
import type { TMDBMovie } from '@/lib/tmdb';
import { posterUrl } from '@/lib/tmdb';
import { genreLabels } from '@/lib/constants';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: TMDBMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const poster = posterUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) || '';
  const genres = movie.genre_ids
    .slice(0, 2)
    .map((id) => genreLabels[id])
    .filter(Boolean)
    .join(', ');

  return (
    <article className="rounded-[var(--radius-card)] bg-card overflow-hidden border border-border shadow-[var(--shadow-card)] transition-lift">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] bg-card">
          {poster ? (
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              unoptimized={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
              No image
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-sm">
            <Star size={14} className="text-accent fill-accent" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
            {movie.title}
          </h3>
        </Link>
        <p className="text-xs text-secondary mt-1">
          {year}
          {genres ? ` · ${genres}` : ''}
        </p>
        {movie.original_title && movie.original_title !== movie.title && (
          <p className="text-xs text-secondary/80 mt-0.5 truncate" title={movie.original_title}>
            {movie.original_title}
          </p>
        )}
      </div>
    </article>
  );
}
