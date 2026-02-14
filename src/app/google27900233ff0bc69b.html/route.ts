import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google27900233ff0bc69b.html', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
