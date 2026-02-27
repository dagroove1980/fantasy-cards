import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getFantasyMoviesMultiPage, getFantasyTVMultiPage } from '@/lib/tmdb';
import { getFantasyBooksMultiSubject, workId } from '@/lib/openlibrary';

export const revalidate = 604800; // 1 week

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/books`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/tv`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  let moviePages: MetadataRoute.Sitemap = [];
  let tvPages: MetadataRoute.Sitemap = [];
  let bookPages: MetadataRoute.Sitemap = [];

  try {
    const [movies, series, booksResult] = await Promise.all([
      getFantasyMoviesMultiPage(10).catch(() => []),
      getFantasyTVMultiPage(5).catch(() => []),
      getFantasyBooksMultiSubject(['fantasy'], 60).catch(() => [] as { key: string }[]),
    ]);

    moviePages = movies.map((m) => ({
      url: `${SITE_URL}/movies/${m.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    tvPages = series.map((s) => ({
      url: `${SITE_URL}/tv/${s.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    bookPages = booksResult.map((b) => ({
      url: `${SITE_URL}/books/${workId(b.key)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Return static pages only if APIs fail
  }

  return [...staticPages, ...moviePages, ...bookPages, ...tvPages];
}
