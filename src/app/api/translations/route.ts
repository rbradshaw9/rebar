import { NextResponse } from 'next/server';

// GET /api/translations — returns all translation overrides from settings table
export async function GET() {
  const { createClient } = await import('@/utils/supabase/server');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .like('key', 'trans_%');

  const overrides: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    overrides[row.key] = row.value;
  });

  return NextResponse.json(overrides);
}

// POST /api/translations — upsert a single translation override
export async function POST(req: Request) {
  // Must be authenticated as admin
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key, value } = await req.json();
  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'key and value required' }, { status: 400 });
  }

  const { createClient } = await import('@/utils/supabase/server');
  const supabase = createClient(cookieStore);
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
