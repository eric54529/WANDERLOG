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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, orders: [], error: '請先登入會員以查看個人訂單' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist yet, explain clearly to help user execute the SQL script
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation "orders"')) {
        return { 
          success: false, 
          orders: [], 
          error: 'Supabase 資料庫中的 `orders` 資料表尚未建立。請將 SQL 腳本貼至 Supabase SQL Editor 執行建立。' 
        };
      }
      return { success: false, orders: [], error: error.message };
    }

    return { success: true, orders: (data as OrderItem[]) || [] };
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: '尚未登入會員，請先登入後再進行下單' };
    }

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

    const insertData = {
      user_id: user.id,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      item: payload.item.trim(),
      quantity: Number(payload.quantity),
      notes: payload.notes?.trim() || null,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { 
          success: false, 
          error: 'Supabase 資料庫中的 `orders` 資料表尚未建立。請至 Supabase SQL Editor 執行所附的 SQL 腳本。' 
        };
      }
      if (error.message.includes('row-level security policy') || error.code === '42501') {
        return {
          success: false,
          error: 'RLS 政策拒絕寫入：請確認 orders 資料表已套用 INSERT 政策 (WITH CHECK (auth.uid() = user_id))。',
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, order: data as OrderItem };
  } catch (err: any) {
    return { success: false, error: err?.message || '下單傳送失敗' };
  }
}
