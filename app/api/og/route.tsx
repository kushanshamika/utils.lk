import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters from URL
  const title = searchParams.get('title') || 'utils.lk';
  const description = searchParams.get('description') || 'Free Online Tools for Sri Lankans';
  const icon = searchParams.get('icon') || '🇱🇰';
  const category = searchParams.get('category') || 'Tools';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top section - Icon and Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '2px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              padding: '8px 20px',
              color: '#fbbf24',
              fontSize: 24,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle section - Title and Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '900px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? 56 : 72,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#94a3b8',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom section - Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.03em',
              }}
            >
              utils.lk
            </div>
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            Made with ❤️ for Sri Lankans
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}