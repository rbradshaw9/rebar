import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import HomeContent from './HomeContent';

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
    .limit(3);

  return <HomeContent upcomingEvents={upcomingEvents} />;
}
