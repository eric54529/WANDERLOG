import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const COUNTER_BASE_URL = 'https://api.counterapi.dev/v2/eric-chens-team-5095/first-counter-5095';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
  const apiKey = process.env.COUNTER_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }
  return headers;
}

// In-memory fallback counter
let localFallbackCounter = 2;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes for CounterAPI ---

  // 1. Get current counter value from CounterAPI
  app.get('/api/counter', async (req, res) => {
    try {
      const statsRes = await fetch(`${COUNTER_BASE_URL}/stats?_t=${Date.now()}`, {
        headers: getAuthHeaders(),
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const upCount = statsData?.data?.up_count ?? statsData?.up_count ?? statsData?.data?.stats?.today?.up;
        if (typeof upCount === 'number') {
          localFallbackCounter = upCount;
          return res.json({ success: true, value: upCount, raw: statsData });
        }
      }

      // Fallback to base endpoint
      const response = await fetch(`${COUNTER_BASE_URL}?_t=${Date.now()}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const count = data?.data?.up_count ?? data?.value ?? data?.count ?? localFallbackCounter;
        return res.json({ success: true, value: count, raw: data });
      }

      res.json({ success: false, value: localFallbackCounter });
    } catch (err: any) {
      console.error('Failed to get counter from CounterAPI:', err.message);
      res.json({ success: false, value: localFallbackCounter, error: err.message });
    }
  });

  // 2. Increment counter (Up) - Uses GET with cache-busting timestamp as required by CounterAPI v2
  app.all('/api/counter/up', async (req, res) => {
    try {
      // CounterAPI v2 increments via GET /up
      const upRes = await fetch(`${COUNTER_BASE_URL}/up?_t=${Date.now()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      // Immediately fetch latest stats to get accurate aggregate count
      const statsRes = await fetch(`${COUNTER_BASE_URL}/stats?_t=${Date.now()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const upCount = statsData?.data?.up_count ?? statsData?.up_count ?? statsData?.data?.stats?.today?.up;
        if (typeof upCount === 'number') {
          localFallbackCounter = upCount;
          return res.json({ success: true, value: upCount, raw: statsData });
        }
      }

      if (upRes.ok) {
        const upData = await upRes.json();
        const upCount = upData?.data?.up_count ?? (localFallbackCounter + 1);
        localFallbackCounter = upCount;
        return res.json({ success: true, value: upCount, raw: upData });
      }

      localFallbackCounter += 1;
      return res.json({ success: false, value: localFallbackCounter });
    } catch (err: any) {
      console.error('Failed to increment CounterAPI:', err.message);
      localFallbackCounter += 1;
      res.json({ success: false, value: localFallbackCounter, error: err.message });
    }
  });

  // 3. Decrement counter (Down)
  app.all('/api/counter/down', async (req, res) => {
    try {
      const downRes = await fetch(`${COUNTER_BASE_URL}/down?_t=${Date.now()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const statsRes = await fetch(`${COUNTER_BASE_URL}/stats?_t=${Date.now()}`, {
        headers: getAuthHeaders(),
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const upCount = statsData?.data?.up_count ?? 0;
        return res.json({ success: true, value: upCount });
      }
      res.json({ success: downRes.ok, value: localFallbackCounter });
    } catch (err: any) {
      res.json({ success: false, value: localFallbackCounter, error: err.message });
    }
  });

  // 4. Get Statistics
  app.get('/api/counter/stats', async (req, res) => {
    try {
      const response = await fetch(`${COUNTER_BASE_URL}/stats?_t=${Date.now()}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        return res.json({ success: false, error: `Status ${response.status}` });
      }
      const data = await response.json();
      res.json({ success: true, stats: data });
    } catch (err: any) {
      res.json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
