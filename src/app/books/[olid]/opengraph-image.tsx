import { ImageResponse } from 'next/og';
import { getBookByWorkId } from '@/lib/openlibrary';

export const alt = 'Fantasy book';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ olid: string }>;
}) {
  const { olid } = await params;
  const book = await getBookByWorkId(olid);
  if (!book) {
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
        Fantasy Cards
      </div>,
      { ...size }
    );
  }

  const cover = book.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : null;

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
        {cover && (
          <img
            src={cover}
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
            Fantasy Book
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
            {book.title}
          </h1>
          {book.first_publish_date && (
            <div style={{ color: '#a1a1aa', fontSize: 24, marginTop: 12 }}>
              First published {book.first_publish_date}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
