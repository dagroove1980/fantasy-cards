import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #302b63, #24243e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffd700',
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: 'serif',
                    border: '1px solid #d4af37',
                    borderRadius: '4px',
                }}
            >
                F
            </div>
        ),
        {
            ...size,
        }
    );
}
