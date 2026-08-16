import { MemberUser } from '../types';
import { supabase } from './supabaseClient';

const CURRENT_MEMBER_KEY = 'wanderlog_current_member_v1';

export function getCurrentMember(): MemberUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_MEMBER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentMember(member: MemberUser | null): void {
  try {
    if (member) {
      localStorage.setItem(CURRENT_MEMBER_KEY, JSON.stringify(member));
    } else {
      localStorage.removeItem(CURRENT_MEMBER_KEY);
    }
  } catch {
    // ignore
  }
}

export async function registerMember(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; member?: MemberUser; error?: string; requiresEmailConfirm?: boolean }> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return { success: false, error: '請輸入暱稱或姓名' };
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: '請輸入有效的電子郵件地址' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: '密碼長度至少需 6 個字元以上' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
      options: {
        data: {
          name: trimmedName,
          display_name: trimmedName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message || '註冊失敗，請重試' };
    }

    if (data.user) {
      const member: MemberUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || trimmedName,
        email: data.user.email || trimmedEmail,
        role: 'member',
        registeredAt: new Date().toISOString().split('T')[0],
      };

      if (data.session) {
        setCurrentMember(member);
      }

      const requiresConfirm = !data.session;
      return {
        success: true,
        member,
        requiresEmailConfirm: requiresConfirm,
      };
    }

    return { success: false, error: '註冊未返回使用者資料' };
  } catch (err: any) {
    return { success: false, error: err?.message || '網路連線或註冊異常' };
  }
}

export async function loginMember(
  email: string,
  password: string
): Promise<{ success: boolean; member?: MemberUser; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: '請輸入正確的電子郵件地址' };
  }
  if (!password) {
    return { success: false, error: '請輸入密碼' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: '帳號或密碼錯誤，請確認後重試' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: '電子郵件尚未驗證，請至信箱點擊確認連結或關閉 Supabase 的 Email Confirmation 設定' };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      const member: MemberUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.user_metadata?.display_name || trimmedEmail.split('@')[0],
        email: data.user.email || trimmedEmail,
        role: 'member',
        registeredAt: data.user.created_at ? data.user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      };

      setCurrentMember(member);
      return { success: true, member };
    }

    return { success: false, error: '登入失敗' };
  } catch (err: any) {
    return { success: false, error: err?.message || '網路連線異常' };
  }
}

export async function logoutMember(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  } finally {
    setCurrentMember(null);
  }
}

export function subscribeToAuthChanges(callback: (member: MemberUser | null) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const user = session.user;
      const member: MemberUser = {
        id: user.id,
        name: user.user_metadata?.name || user.user_metadata?.display_name || user.email?.split('@')[0] || '會員',
        email: user.email || '',
        role: 'member',
        registeredAt: user.created_at ? user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      };
      setCurrentMember(member);
      callback(member);
    } else {
      setCurrentMember(null);
      callback(null);
    }
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}
