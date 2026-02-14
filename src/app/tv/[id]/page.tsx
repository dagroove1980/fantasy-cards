import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTVById, getSimilarTV, posterUrl } from '@/lib/tmdb';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';
import { Star, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { getFantasyTVMultiPage } = await import('@/lib/tmdb');
  const series = await getFantasyTVMultiPage(5);
  return series.slice(0, 100).map((s) => ({ id: String(s.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const show = await getTVById(id);
  if (!show) return {};

  const year = show.first_air_date?.slice(0, 4) || '';
  const title = year ? `${show.name} (${year}) — Fantasy TV` : `${show.name} — Fantasy TV`;
  const desc = show.overview?.slice(0, 160) || `Fantasy TV series: ${show.name}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `/tv/${id}`,
      type: 'article',
      images: show.poster_path
        ? [{ url: `https://image.tmdb.org/t/p/w500${show.poster_path}` }]
        : [],
    },
    alternates: { canonical: `/tv/${id}` },
  };
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  const [show, similarRes] = await Promise.all([
    getTVById(id),
    getSimilarTV(id).catch(() => ({ results: [] })),
  ]);
  if (!show) notFound();

  const poster = posterUrl(show.poster_path);
  const similar = similarRes.results?.filter((s) => s.id !== show.id).slice(0, 8) ?? [];
  const year = show.first_air_date?.slice(0, 4) || '';
  const genres = show.genres?.map((g) => g.name).join(', ') || '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview,
    image: poster,
    datePublished: show.first_air_date,
    aggregateRating: show.vote_count
      ? {
          '@type': 'AggregateRating',
          ratingValue: show.vote_average,
          bestRating: 10,
          ratingCount: show.vote_count,
        }
      : undefined,
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
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
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'TV Shows', item: `${SITE_URL}/tv` },
              { '@type': 'ListItem', position: 3, name: show.name, item: `${SITE_URL}/tv/${id}` },
            ],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/tv"
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-accent mb-6"
        >
          <ArrowLeft size={16} />
          Back to TV shows
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {poster && (
            <div className="relative w-full md:w-64 shrink-0 aspect-[2/3] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <Image
                src={poster}
                alt={show.name}
                fill
                className="object-cover"
                priority
                sizes="256px"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {show.name}
            </h1>
            <p className="text-secondary mt-2">
              {year}
              {genres ? ` · ${genres}` : ''}
            </p>
            {(show.number_of_seasons || show.number_of_episodes) && (
              <p className="text-secondary text-sm mt-1">
                {show.number_of_seasons && `${show.number_of_seasons} seasons`}
                {show.number_of_seasons && show.number_of_episodes && ' · '}
                {show.number_of_episodes && `${show.number_of_episodes} episodes`}
              </p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Star size={20} className="text-accent fill-accent" />
              <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
              <span className="text-secondary text-sm">({show.vote_count} votes)</span>
            </div>
            <p className="text-foreground/90 mt-4 leading-relaxed">{show.overview}</p>
            <p className="text-foreground/80 mt-6 text-sm">
              Explore more fantasy TV shows in our curated collection.
            </p>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
              More like this
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similar.map((s) => {
                const p = posterUrl(s.poster_path, 'w300');
                const y = s.first_air_date?.slice(0, 4) || '';
                return (
                  <Link
                    key={s.id}
                    href={`/tv/${s.id}`}
                    className="group rounded-[var(--radius-card)] overflow-hidden border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="relative aspect-[2/3] bg-card">
                      {p ? (
                        <Image
                          src={p}
                          alt={s.name}
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
                        {s.name}
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
    </>
  );
}
