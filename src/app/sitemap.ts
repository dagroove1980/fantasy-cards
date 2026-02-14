import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getFantasyMovies } from '@/lib/tmdb';
import { getFantasyBooks, workId } from '@/lib/openlibrary';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [moviesRes, booksRes] = await Promise.all([
    getFantasyMovies(1),
    getFantasyBooks('fantasy', 1, 100),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/books`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  const moviePages = moviesRes.results.map((m) => ({
    url: `${SITE_URL}/movies/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const bookPages = booksRes.docs.map((b) => ({
    url: `${SITE_URL}/books/${workId(b.key)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...moviePages, ...bookPages];
}
