import type { TMDBMovie, TMDBMovieDetail } from './tmdb';
import type { OpenLibraryBook } from './openlibrary';
import { SITE_URL, genreLabels } from './constants';

export function movieMetaTitle(movie: TMDBMovie): string {
  const year = movie.release_date?.slice(0, 4) || '';
  return year ? `${movie.title} (${year}) — Fantasy Film` : `${movie.title} — Fantasy Film`;
}

export function movieMetaDescription(movie: TMDBMovie): string {
  const year = movie.release_date?.slice(0, 4) || '';
  const excerpt = movie.overview?.slice(0, 140) || '';
  return `${movie.title}${year ? ` (${year})` : ''}. ${excerpt}${excerpt.length >= 140 ? '...' : ''}`;
}

export function bookMetaTitle(book: OpenLibraryBook): string {
  const author = book.author_name?.[0] || '';
  return author ? `${book.title} by ${author} — Fantasy Book` : `${book.title} — Fantasy Book`;
}

export function bookMetaDescription(book: OpenLibraryBook): string {
  const author = book.author_name?.join(', ') || '';
  const year = book.first_publish_year || '';
  return `${book.title}${author ? ` by ${author}` : ''}${year ? ` (${year})` : ''}. A fantasy novel from our curated collection.`;
}

export function movieStructuredData(movie: TMDBMovieDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date || undefined,
    aggregateRating: movie.vote_count
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average,
          bestRating: 10,
          ratingCount: movie.vote_count,
        }
      : undefined,
    genre: movie.genres?.map((g) => g.name) || [],
  };
}

export function bookStructuredData(book: OpenLibraryBook) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: book.author_name?.map((name) => ({ '@type': 'Person', name })),
    datePublished: book.first_publish_year?.toString(),
    image: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : undefined,
  };
}

export function breadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
