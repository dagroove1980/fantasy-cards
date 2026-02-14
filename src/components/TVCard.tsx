import Link from 'next/link';
import Image from 'next/image';
import type { TMDBSeries } from '@/lib/tmdb';
import { posterUrl } from '@/lib/tmdb';
import { genreLabels } from '@/lib/constants';
import { Star } from 'lucide-react';

interface TVCardProps {
  series: TMDBSeries;
}

export function TVCard({ series }: TVCardProps) {
  const poster = posterUrl(series.poster_path);
  const year = series.first_air_date?.slice(0, 4) || '';
  const genres = series.genre_ids
    .slice(0, 2)
    .map((id) => genreLabels[id])
    .filter(Boolean)
    .join(', ');

  return (
    <article className="rounded-[var(--radius-card)] bg-card overflow-hidden border border-border shadow-[var(--shadow-card)] transition-lift">
      <Link href={`/tv/${series.id}`} className="block">
        <div className="relative aspect-[2/3] bg-card">
          {poster ? (
            <Image
              src={poster}
              alt={series.name}
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
            <span>{series.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/tv/${series.id}`}>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
            {series.name}
          </h3>
        </Link>
        <p className="text-xs text-secondary mt-1">
          {year}
          {genres ? ` · ${genres}` : ''}
        </p>
        {series.original_name && series.original_name !== series.name && (
          <p className="text-xs text-secondary/80 mt-0.5 truncate" title={series.original_name}>
            {series.original_name}
          </p>
        )}
      </div>
    </article>
  );
}
