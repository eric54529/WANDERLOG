import { supabase } from './supabaseClient';
import { OrderItem } from '../types';

export interface CreateOrderPayload {
  name: string;
  phone: string;
  item: string;
  quantity: number;
  notes?: string;
}

export async function fetchUserOrders(): Promise<{ success: boolean; orders: OrderItem[]; error?: string }> {
  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    const sessionUser = sessionData?.session?.user;

    let user = sessionUser;
    if (!user) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        return { success: false, orders: [], error: '請先登入會員以查看個人訂單' };
      }
      user = userData.user;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation "orders"')) {
        return { 
          success: false, 
          orders: [], 
          error: 'Supabase 資料庫中的 orders 資料表尚未建立。請至「SQL 建立腳本」複製並在 Supabase SQL Editor 執行。' 
        };
      }
      if (error.code === '42501' || error.message.includes('row-level security')) {
        return {
          success: false,
          orders: [],
          error: 'RLS 權限限制：請確認已在 Supabase 執行 SELECT 政策 (CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id))。',
        };
      }
      return { success: false, orders: [], error: error.message };
    }

    // Standardize notes/note field
    const standardizedOrders: OrderItem[] = ((data as any[]) || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      phone: row.phone,
      item: row.item,
      quantity: row.quantity,
      notes: row.notes || row.note || '',
      created_at: row.created_at,
    }));

    return { success: true, orders: standardizedOrders };
  } catch (err: any) {
    return { success: false, orders: [], error: err?.message || '讀取訂單發生異常' };
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  success: boolean;
  order?: OrderItem;
  error?: string;
}> {
  try {
    // 1. Get current authenticated user
    const { data: sessionData } = await supabase.auth.getSession();
    let currentUser = sessionData?.session?.user;

    if (!currentUser) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        return { success: false, error: '尚未登入或會員憑證已過期，請重新登入帳號後再送出訂單。' };
      }
      currentUser = userData.user;
    }

    // 2. Validate input fields
    if (!payload.name.trim()) {
      return { success: false, error: '請輸入訂購人姓名' };
    }
    if (!payload.phone.trim()) {
      return { success: false, error: '請輸入聯絡電話' };
    }
    if (!payload.item.trim()) {
      return { success: false, error: '請選擇或輸入品項名稱' };
    }
    if (!payload.quantity || payload.quantity < 1) {
      return { success: false, error: '訂購數量至少需為 1' };
    }

    const noteText = payload.notes?.trim() || null;

    // 3. Primary insert attempt with 'notes' column
    const insertPayloadWithNotes = {
      user_id: currentUser.id,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      item: payload.item.trim(),
      quantity: Number(payload.quantity),
      notes: noteText,
    };

    let { data, error } = await supabase
      .from('orders')
      .insert([insertPayloadWithNotes])
      .select()
      .single();

    // 4. If error is column mismatch (e.g. table has 'note' instead of 'notes')
    if (error && (error.code === '42703' || error.message.includes('notes') || error.message.includes('column'))) {
      const insertPayloadWithNote = {
        user_id: currentUser.id,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        item: payload.item.trim(),
        quantity: Number(payload.quantity),
        note: noteText,
      };

      const retryRes = await supabase
        .from('orders')
        .insert([insertPayloadWithNote])
        .select()
        .single();

      if (!retryRes.error) {
        data = retryRes.data;
        error = null;
      } else {
        error = retryRes.error;
      }
    }

    // 5. If insert was blocked by SELECT RLS policy on .select().single() but insert itself might have succeeded without select
    if (error && (error.message.includes('row-level security') || error.code === '42501')) {
      // Try a direct insert without select to see if INSERT policy succeeds
      const fallbackInsert = await supabase
        .from('orders')
        .insert([{
          user_id: currentUser.id,
          name: payload.name.trim(),
          phone: payload.phone.trim(),
          item: payload.item.trim(),
          quantity: Number(payload.quantity),
          notes: noteText,
        }]);

      if (!fallbackInsert.error) {
        const fallbackOrder: OrderItem = {
          id: `ord-${Date.now()}`,
          user_id: currentUser.id,
          name: payload.name.trim(),
          phone: payload.phone.trim(),
          item: payload.item.trim(),
          quantity: Number(payload.quantity),
          notes: noteText,
          created_at: new Date().toISOString(),
        };
        return { success: true, order: fallbackOrder };
      }
    }

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation "orders"')) {
        return { 
          success: false, 
          error: 'Supabase 資料庫中的 orders 資料表尚未建立。請至「SQL 建立腳本」頁籤複製並至 Supabase SQL Editor 執行。' 
        };
      }
      if (error.message.includes('row-level security') || error.code === '42501') {
        return {
          success: false,
          error: 'RLS 安全政策驗證未通過。請確認已執行 SQL 腳本中的 INSERT 政策 (WITH CHECK (auth.uid() = user_id))，且以登入狀態送出。',
        };
      }
      return { success: false, error: `下單失敗 (${error.message})` };
    }

    const created: OrderItem = {
      id: (data as any)?.id || `ord-${Date.now()}`,
      user_id: (data as any)?.user_id || currentUser.id,
      name: (data as any)?.name || payload.name.trim(),
      phone: (data as any)?.phone || payload.phone.trim(),
      item: (data as any)?.item || payload.item.trim(),
      quantity: Number((data as any)?.quantity || payload.quantity),
      notes: (data as any)?.notes || (data as any)?.note || noteText,
      created_at: (data as any)?.created_at || new Date().toISOString(),
    };

    return { success: true, order: created };
  } catch (err: any) {
    return { success: false, error: err?.message || '下單過程發生未預期錯誤，請檢查網路連線。' };
  }
}
