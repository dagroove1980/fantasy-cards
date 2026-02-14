import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieById } from '@/lib/tmdb';
import { posterUrl } from '@/lib/tmdb';
import { movieMetaTitle, movieMetaDescription, movieStructuredData, breadcrumbStructuredData } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';
import { Star, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { getFantasyMoviesMultiPage } = await import('@/lib/tmdb');
  const movies = await getFantasyMoviesMultiPage(5);
  return movies.slice(0, 100).map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) return {};

  return {
    title: movieMetaTitle(movie),
    description: movieMetaDescription(movie),
    openGraph: {
      title: movieMetaTitle(movie),
      description: movieMetaDescription(movie),
      url: `/movies/${id}`,
      type: 'article',
      images: movie.poster_path
        ? [{ url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }]
        : [],
    },
    alternates: { canonical: `/movies/${id}` },
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  const poster = posterUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) || '';
  const genres = movie.genres?.map((g) => g.name).join(', ') || '';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieStructuredData(movie)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbStructuredData([
              { name: 'Home', url: '/' },
              { name: 'Movies', url: '/movies' },
              { name: movie.title, url: `/movies/${id}` },
            ])
          ),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/movies"
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-accent mb-6"
        >
          <ArrowLeft size={16} />
          Back to movies
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {poster && (
            <div className="relative w-full md:w-64 shrink-0 aspect-[2/3] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <Image
                src={poster}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="256px"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {movie.title}
            </h1>
            <p className="text-secondary mt-2">
              {year}
              {genres ? ` · ${genres}` : ''}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Star size={20} className="text-accent fill-accent" />
              <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
              <span className="text-secondary text-sm">({movie.vote_count} votes)</span>
            </div>
            {movie.tagline && (
              <p className="italic text-accent mt-4">"{movie.tagline}"</p>
            )}
            <p className="text-foreground/90 mt-4 leading-relaxed">{movie.overview}</p>
            <p className="text-foreground/80 mt-6 text-sm">
              Explore more fantasy movies in our curated collection. Filter by genre, rating, or decade.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
