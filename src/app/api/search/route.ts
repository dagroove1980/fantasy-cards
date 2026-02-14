import { NextRequest } from 'next/server';
import { searchMovies, searchTV } from '@/lib/tmdb';
import { searchBooks } from '@/lib/openlibrary';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  const type = request.nextUrl.searchParams.get('type') || 'all';

  if (!q.trim()) {
    return Response.json({ results: [], docs: [], tv: [] });
  }

  if (type === 'movies') {
    const data = await searchMovies(q, 1);
    return Response.json({ results: data.results });
  }

  if (type === 'books') {
    const data = await searchBooks(q, 1, 20);
    return Response.json({ docs: data.docs });
  }

  if (type === 'tv') {
    const data = await searchTV(q, 1);
    return Response.json({ tv: data.results });
  }

  // type === 'all'
  const [moviesRes, booksRes, tvRes] = await Promise.all([
    searchMovies(q, 1),
    searchBooks(q, 1, 8),
    searchTV(q, 1),
  ]);

  return Response.json({
    results: moviesRes.results,
    docs: booksRes.docs,
    tv: tvRes.results,
  });
}
