import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieById, getSimilarMovies, posterUrl, backdropUrl } from '@/lib/tmdb';
import { movieMetaTitle, movieMetaDescription, movieStructuredData, breadcrumbStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';
import { Star, ArrowLeft, Clock, ExternalLink, Play, Film } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  const { getFantasyMoviesMultiPage } = await import('@/lib/tmdb');
  const movies = await getFantasyMoviesMultiPage(10);
  return movies.slice(0, 200).map((m) => ({ id: String(m.id) }));
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
  const [movie, similarRes] = await Promise.all([
    getMovieById(id),
    getSimilarMovies(id).catch(() => ({ results: [] })),
  ]);
  if (!movie) notFound();

  const poster = posterUrl(movie.poster_path);
  const backdrop = backdropUrl(movie.backdrop_path);
  const similar = similarRes.results?.filter((m) => m.id !== movie.id).slice(0, 8) ?? [];
  const year = movie.release_date?.slice(0, 4) || '';
  const genres = movie.genres?.map((g) => g.name).join(', ') || '';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 10) ?? [];
  const trailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  const watchProviders = movie['watch/providers']?.results?.US;

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

      <div className="max-w-4xl mx-auto">
        {backdrop && (
          <div className="relative h-48 sm:h-64 -mt-4 -mx-4 sm:-mx-0 sm:rounded-t-xl overflow-hidden">
            <Image
              src={backdrop}
              alt=""
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        <div className="px-4 py-8">
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
              {runtime && (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} />
                    {runtime}
                  </span>
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-accent fill-accent" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-secondary text-sm">({movie.vote_count} votes)</span>
              </div>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <ExternalLink size={14} />
                  View on IMDB
                </a>
              )}
            </div>
            {movie.tagline && (
              <p className="italic text-accent mt-4">"{movie.tagline}"</p>
            )}
            <p className="text-foreground/90 mt-4 leading-relaxed">{movie.overview}</p>
            {director && (
              <p className="text-foreground/80 mt-4 text-sm">
                <span className="text-secondary">Directed by</span> {director.name}
              </p>
            )}
            <p className="text-foreground/80 mt-6 text-sm">
              Explore more fantasy movies in our curated collection. Filter by genre, rating, or decade.
            </p>
          </div>
        </div>

        {trailer && (
          <section className="px-4 mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Play size={20} />
              Trailer
            </h2>
            <div className="aspect-video max-w-2xl rounded-lg overflow-hidden border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section className="px-4 mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Film size={20} />
              Cast
            </h2>
            <p className="text-foreground/80 text-sm">
              {cast.map((c) => c.name).join(' · ')}
            </p>
          </section>
        )}

        {watchProviders &&
          (watchProviders.flatrate?.length || watchProviders.rent?.length || watchProviders.buy?.length) && (
          <section className="px-4 mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              Where to watch
            </h2>
            <div className="flex flex-wrap gap-4">
              {watchProviders.flatrate?.map((p) => (
                <span key={p.provider_id} className="text-sm text-foreground/80" title="Stream">
                  {p.provider_name}
                </span>
              ))}
              {watchProviders.rent?.map((p) => (
                <span key={p.provider_id} className="text-sm text-foreground/80" title="Rent">
                  {p.provider_name} (rent)
                </span>
              ))}
              {watchProviders.buy?.map((p) => (
                <span key={p.provider_id} className="text-sm text-foreground/80" title="Buy">
                  {p.provider_name} (buy)
                </span>
              ))}
            </div>
            {watchProviders.link && (
              <a
                href={watchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-2"
              >
                <ExternalLink size={14} />
                Check availability on JustWatch
              </a>
            )}
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-12 px-4">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              More like this
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similar.map((m) => {
                const p = posterUrl(m.poster_path, 'w300');
                const y = m.release_date?.slice(0, 4) || '';
                return (
                  <Link
                    key={m.id}
                    href={`/movies/${m.id}`}
                    className="group rounded-[var(--radius-card)] overflow-hidden border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="relative aspect-[2/3] bg-card">
                      {p ? (
                        <Image
                          src={p}
                          alt={m.title}
                          fill
                          sizes="150px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="font-heading font-medium text-foreground text-sm line-clamp-2 group-hover:text-accent">
                        {m.title}
                      </h3>
                      <p className="text-xs text-secondary">{y}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        </div>
      </div>
    </>
  );
}
