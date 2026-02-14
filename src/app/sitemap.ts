import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getFantasyMoviesMultiPage } from '@/lib/tmdb';
import { getFantasyBooksMultiSubject, workId } from '@/lib/openlibrary';
import { FANTASY_SUBJECTS } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getFantasyMoviesMultiPage(10);
  const books = await getFantasyBooksMultiSubject(
    ['fantasy', 'high_fantasy', 'epic_fantasy'],
    80
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/books`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  const moviePages = movies.map((m) => ({
    url: `${SITE_URL}/movies/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const bookPages = books.map((b) => ({
    url: `${SITE_URL}/books/${workId(b.key)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...moviePages, ...bookPages];
}
