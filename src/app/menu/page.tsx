import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import MenuContent from './MenuContent';

export default async function MenuPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true });

  return <MenuContent menuItems={menuItems} />;
}
