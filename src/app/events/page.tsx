import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import EventsContent from './EventsContent';

export default async function EventsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const today = new Date().toISOString().split('T')[0];

  const { data: upcoming } = await supabase.from('events').select('*')
    .eq('is_published', true).gte('event_date', today).order('event_date', { ascending: true });
  const { data: past } = await supabase.from('events').select('*')
    .eq('is_published', true).lt('event_date', today).order('event_date', { ascending: false }).limit(6);

  return <EventsContent upcoming={upcoming} past={past} />;
}
