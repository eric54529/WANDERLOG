const LOCAL_SHARE_COUNT_KEY = 'wanderlog_share_counter_cache';
const DIRECT_COUNTER_BASE = 'https://api.counterapi.dev/v2/eric-chens-team-5095/first-counter-5095';

export async function getShareCounter(): Promise<number> {
  // 1. Try internal backend proxy
  try {
    const res = await fetch(`/api/counter?_t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        localStorage.setItem(LOCAL_SHARE_COUNT_KEY, String(data.value));
        return data.value;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch share counter from server proxy, trying direct API:', err);
  }

  // 2. Direct CounterAPI fallback
  try {
    const directRes = await fetch(`${DIRECT_COUNTER_BASE}/stats?_t=${Date.now()}`);
    if (directRes.ok) {
      const directData = await directRes.json();
      const count = directData?.data?.up_count ?? directData?.up_count ?? directData?.data?.stats?.today?.up;
      if (typeof count === 'number') {
        localStorage.setItem(LOCAL_SHARE_COUNT_KEY, String(count));
        return count;
      }
    }
  } catch (err) {
    console.warn('Direct CounterAPI fetch error:', err);
  }

  // 3. Fallback to local storage
  const cached = localStorage.getItem(LOCAL_SHARE_COUNT_KEY);
  return cached ? parseInt(cached, 10) : 2;
}

export async function incrementShareCounter(): Promise<number> {
  let newCount = 0;

  // 1. Try internal backend proxy (calls CounterAPI /up)
  try {
    const res = await fetch(`/api/counter/up?_t=${Date.now()}`, {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        newCount = data.value;
        localStorage.setItem(LOCAL_SHARE_COUNT_KEY, String(newCount));
        return newCount;
      }
    }
  } catch (err) {
    console.warn('Failed to increment share counter via server proxy:', err);
  }

  // 2. Direct CounterAPI fallback (GET /up)
  try {
    await fetch(`${DIRECT_COUNTER_BASE}/up?_t=${Date.now()}`, {
      method: 'GET',
    });
    const statsRes = await fetch(`${DIRECT_COUNTER_BASE}/stats?_t=${Date.now()}`);
    if (statsRes.ok) {
      const statsData = await statsRes.json();
      const count = statsData?.data?.up_count ?? statsData?.up_count;
      if (typeof count === 'number') {
        newCount = count;
        localStorage.setItem(LOCAL_SHARE_COUNT_KEY, String(newCount));
        return newCount;
      }
    }
  } catch (err) {
    console.warn('Direct CounterAPI increment error:', err);
  }

  // 3. Fallback increment in local storage
  const current = localStorage.getItem(LOCAL_SHARE_COUNT_KEY);
  newCount = (current ? parseInt(current, 10) : 2) + 1;
  localStorage.setItem(LOCAL_SHARE_COUNT_KEY, String(newCount));
  return newCount;
}
