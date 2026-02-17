import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FantasyMovies — Movies, Books & TV';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)', // Night sky gradient
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'serif',
                    position: 'relative',
                }}
            >
                {/* Mystical border */}
                <div
                    style={{
                        position: 'absolute',
                        top: 20, left: 20, right: 20, bottom: 20,
                        border: '2px solid rgba(255, 215, 0, 0.3)', // Gold transparent
                        borderRadius: '12px',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 30, left: 30, right: 30, bottom: 30,
                        border: '1px solid rgba(255, 215, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                />

                {/* Glowing orb/moon effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: -100,
                        width: 600,
                        height: 600,
                        background: 'radial-gradient(circle, rgba(123, 31, 162, 0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        borderRadius: '50%',
                    }}
                />

                <div
                    style={{
                        fontSize: 96,
                        fontWeight: 700,
                        color: 'transparent',
                        backgroundClip: 'text',
                        backgroundImage: 'linear-gradient(to bottom, #ffd700, #b8860b)', // Gold gradient text
                        textTransform: 'uppercase',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        zIndex: 10,
                        letterSpacing: '0.05em',
                        marginBottom: 20,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    FantasyMovies
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 40,
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <div style={{ color: '#d4af37', fontSize: 24, letterSpacing: '0.1em' }}>MOVIES</div>
                    <div style={{ width: 8, height: 8, background: '#d4af37', borderRadius: '50%' }} />
                    <div style={{ color: '#d4af37', fontSize: 24, letterSpacing: '0.1em' }}>BOOKS</div>
                    <div style={{ width: 8, height: 8, background: '#d4af37', borderRadius: '50%' }} />
                    <div style={{ color: '#d4af37', fontSize: 24, letterSpacing: '0.1em' }}>TV</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
