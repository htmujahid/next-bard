import { NextResponse } from 'next/server';

import { generateOpenAPISpec } from '@/orpc/generator';

export async function GET() {
  const spec = await generateOpenAPISpec();

  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
