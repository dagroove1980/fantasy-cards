const OL_BASE = 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org/b';

export interface OpenLibraryBook {
  key: string; // /works/OL123W
  title: string;
  first_publish_year?: number;
  cover_i?: number;
  author_name?: string[];
  subject?: string[];
  isbn?: string[];
  edition_count?: number;
  number_of_pages_median?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export function coverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'L'): string | null {
  if (!coverId) return null;
  return `${COVER_BASE}/id/${coverId}-${size}.jpg`;
}

/** Get work ID for URL (e.g. OL123W from /works/OL123W) */
export function workId(key: string): string {
  return key.replace('/works/', '');
}

async function olFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${OL_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Open Library API error: ${res.status}`);
  return res.json();
}

/** Fetch fantasy books by subject */
export async function getFantasyBooks(
  subject = 'fantasy',
  page = 1,
  limit = 20
): Promise<OpenLibrarySearchResponse> {
  const offset = (page - 1) * limit;
  return olFetch<OpenLibrarySearchResponse>('/search.json', {
    subject,
    limit,
    offset,
    fields: 'key,title,first_publish_year,cover_i,author_name,subject',
    sort: 'rating desc',
  });
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch fantasy books from multiple subjects and merge (larger catalog) */
export async function getFantasyBooksMultiSubject(
  subjects: string[],
  limitPerSubject = 50
): Promise<OpenLibraryBook[]> {
  const all: OpenLibraryBook[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < subjects.length; i++) {
    if (i > 0) await delay(1200); // Throttle to avoid Open Library 429
    const res = await getFantasyBooks(subjects[i], 1, limitPerSubject);
    for (const doc of res.docs) {
      const id = doc.key;
      if (!seen.has(id)) {
        seen.add(id);
        all.push(doc);
      }
    }
  }

  return all;
}

/** Search books */
export async function searchBooks(
  query: string,
  page = 1,
  limit = 20
): Promise<OpenLibrarySearchResponse> {
  const offset = (page - 1) * limit;
  return olFetch<OpenLibrarySearchResponse>('/search.json', {
    q: query,
    limit,
    offset,
    fields: 'key,title,first_publish_year,cover_i,author_name,subject',
  });
}

/** Get work details */
export async function getBookByWorkId(
  workId: string
): Promise<{ title: string; description?: string; subjects?: string[]; authors?: { author: { key: string }; type?: { key: string } }[]; first_publish_date?: string; covers?: number[] } | null> {
  try {
    const data = await olFetch<{
      title: string;
      description?: string | { value: string };
      subjects?: string[];
      authors?: { author: { key: string }; type?: { key: string } }[];
      first_publish_date?: string;
      covers?: number[];
    }>(`/works/${workId}.json`);
    const description =
      typeof data.description === 'string'
        ? data.description
        : data.description?.value;
    return {
      ...data,
      description,
      subjects: data.subjects,
    };
  } catch {
    return null;
  }
}
