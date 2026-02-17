import { ImageResponse } from 'next/og';
import { getMovieById } from '@/lib/tmdb';
import { posterUrl } from '@/lib/tmdb';

export const alt = 'Fantasy movie';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f12',
          color: '#a1a1aa',
          fontSize: 24,
        }}
      >
        FantasyMovies
      </div>,
      { ...size }
    );
  }

  const poster = posterUrl(movie.poster_path, 'w500');
  const year = movie.release_date?.slice(0, 4) || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0f0f12',
        }}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            style={{
              width: 420,
              height: 630,
              objectFit: 'cover',
            }}
          />
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 48,
          }}
        >
          <div
            style={{
              color: '#a78bfa',
              fontSize: 14,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Fantasy Movie
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 48,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {movie.title}
          </h1>
          {year && (
            <div style={{ color: '#a1a1aa', fontSize: 24, marginTop: 12 }}>
              {year} · ★ {movie.vote_average.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
