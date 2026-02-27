const OL_BASE = 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org/b';

export interface OpenLibraryBook {
  key: string; // /works/OL123W
  title: string;
  first_publish_year?: number;
  cover_i?: number;
  author_name?: string[];
  author_key?: string[];
  subject?: string[];
  isbn?: string[];
  edition_count?: number;
  number_of_pages_median?: number;
  ratings_average?: number;
  ratings_count?: number;
  ebook_access?: string;
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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function olFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${OL_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url.toString(), {
      next: { revalidate: 604800 }, // 1 week
    });
    if (res.ok) return res.json();

    if (res.status === 429) {
      const waitMs = Math.min(3000 * Math.pow(2, attempt), 15000);
      await delay(waitMs);
      lastError = new Error(`Open Library API error: ${res.status}`);
      continue;
    }

    throw new Error(`Open Library API error: ${res.status}`);
  }
  throw lastError ?? new Error('Open Library API error');
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
    fields: 'key,title,first_publish_year,cover_i,author_name,author_key,subject,edition_count,number_of_pages_median,ratings_average,ratings_count,ebook_access',
    sort: 'rating desc',
  });
}

/** Fetch fantasy books from multiple subjects and merge (larger catalog) */
export async function getFantasyBooksMultiSubject(
  subjects: string[],
  limitPerSubject = 50
): Promise<OpenLibraryBook[]> {
  const all: OpenLibraryBook[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < subjects.length; i++) {
    if (i > 0) await delay(2000); // Throttle to avoid Open Library 429
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
    fields: 'key,title,first_publish_year,cover_i,author_name,author_key,subject,edition_count,number_of_pages_median,ratings_average,ratings_count,ebook_access',
  });
}

/** Get related books by same subject (excluding current work) */
export async function getRelatedBooks(
  olid: string,
  limit = 12
): Promise<OpenLibraryBook[]> {
  const book = await getBookByWorkId(olid);
  if (!book || !book.subjects?.length) return [];

  const currentKey = `/works/${olid}`;
  const subject = book.subjects[0];
  const res = await getFantasyBooks(subject, 1, limit + 5);
  const seen = new Set<string>([currentKey]);
  const related: OpenLibraryBook[] = [];
  for (const doc of res.docs) {
    if (related.length >= limit) break;
    const id = doc.key;
    if (!seen.has(id)) {
      seen.add(id);
      related.push(doc);
    }
  }
  return related;
}

export interface OLWorkLink {
  title: string;
  url: string;
}

export interface OLWorkExcerpt {
  excerpt?: string;
  comment?: string;
}

/** Get author by key (e.g. OL26320A) */
export async function getAuthorById(
  authorKey: string
): Promise<{ name: string; personal_name?: string; bio?: string; birth_date?: string; death_date?: string; photos?: number[]; links?: { title: string; url: string }[]; top_work?: string; top_subjects?: string[] } | null> {
  try {
    const key = authorKey.startsWith('/authors/') ? authorKey : `/authors/${authorKey}`;
    const data = await olFetch<{
      name: string;
      personal_name?: string;
      bio?: string | { value: string };
      birth_date?: string;
      death_date?: string;
      photos?: number[];
      links?: { title: string; url: string }[];
      top_work?: string;
      top_subjects?: string[];
    }>(`${key}.json`);
    const bio = typeof data.bio === 'string' ? data.bio : data.bio?.value;
    return { ...data, bio };
  } catch {
    return null;
  }
}

/** Get author's works (via search for richer data) */
export async function getAuthorWorks(
  authorKey: string,
  limit = 24
): Promise<OpenLibraryBook[]> {
  try {
    const cleanKey = authorKey.replace(/^\/?authors\//, '');
    const data = await olFetch<OpenLibrarySearchResponse>('/search.json', {
      author_key: cleanKey,
      limit,
      fields: 'key,title,first_publish_year,cover_i,author_name',
    });
    return data.docs ?? [];
  } catch {
    return [];
  }
}

/** Get work ratings */
export async function getBookRatings(
  olid: string
): Promise<{ average: number; count: number } | null> {
  try {
    const data = await olFetch<{ summary?: { average?: number; count?: number } }>(
      `/works/${olid}/ratings.json`
    );
    const s = data.summary;
    if (!s || s.count === 0) return null;
    return { average: s.average ?? 0, count: s.count ?? 0 };
  } catch {
    return null;
  }
}

/** Get work details including links, excerpts */
export async function getBookByWorkId(
  workId: string
): Promise<{
  title: string;
  description?: string;
  subjects?: string[];
  authors?: { author: { key: string }; type?: { key: string } }[];
  first_publish_date?: string;
  covers?: number[];
  links?: OLWorkLink[];
  excerpts?: OLWorkExcerpt[];
  subject_people?: string[];
} | null> {
  try {
    const data = await olFetch<{
      title: string;
      description?: string | { value: string };
      subjects?: string[];
      authors?: { author: { key: string }; type?: { key: string } }[];
      first_publish_date?: string;
      covers?: number[];
      links?: { title: string; url: string }[];
      excerpts?: { excerpt?: string; comment?: string }[];
      subject_people?: string[];
    }>(`/works/${workId}.json`);
    const description =
      typeof data.description === 'string'
        ? data.description
        : data.description?.value;
    return {
      ...data,
      description,
      subjects: data.subjects,
      links: data.links,
      excerpts: data.excerpts,
      subject_people: data.subject_people,
    };
  } catch {
    return null;
  }
}
