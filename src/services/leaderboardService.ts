export interface LeaderboardEntry {
  id?: string;
  player_name: string;
  score: number;
  created_at?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to a simple in-memory storage if Supabase is not configured
let fallbackStorage: LeaderboardEntry[] = [];

export async function submitScore(playerName: string, score: number): Promise<LeaderboardEntry | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Fallback: store in memory
    const entry: LeaderboardEntry = {
      player_name: playerName,
      score,
      created_at: new Date().toISOString(),
    };
    fallbackStorage.push(entry);
    fallbackStorage.sort((a, b) => b.score - a.score);
    fallbackStorage = fallbackStorage.slice(0, 100); // Keep top 100
    return entry;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        player_name: playerName,
        score,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check for secret key error
      if (errorData.message?.includes('secret API key') || errorData.hint?.includes('secret API key')) {
        console.error(
          '❌ ERROR: You are using a SECRET API key in the browser!\n' +
          'Please use the ANON (public) key from Supabase:\n' +
          '1. Go to Project Settings → API\n' +
          '2. Copy the "anon" or "public" key (NOT the service_role key)\n' +
          '3. Update your .env file with VITE_SUPABASE_ANON_KEY=your-anon-key'
        );
        throw new Error('Invalid API key: Please use the anon/public key, not the service_role key');
      }
      
      throw new Error(`Failed to submit score: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error submitting score:', error);
    // Fallback to in-memory storage
    const entry: LeaderboardEntry = {
      player_name: playerName,
      score,
      created_at: new Date().toISOString(),
    };
    fallbackStorage.push(entry);
    fallbackStorage.sort((a, b) => b.score - a.score);
    fallbackStorage = fallbackStorage.slice(0, 100);
    return entry;
  }
}

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Return fallback storage
    return fallbackStorage.slice(0, limit);
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=score.desc&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check for secret key error
      if (errorData.message?.includes('secret API key') || errorData.hint?.includes('secret API key')) {
        console.error(
          '❌ ERROR: You are using a SECRET API key in the browser!\n' +
          'Please use the ANON (public) key from Supabase:\n' +
          '1. Go to Project Settings → API\n' +
          '2. Copy the "anon" or "public" key (NOT the service_role key)\n' +
          '3. Update your .env file with VITE_SUPABASE_ANON_KEY=your-anon-key'
        );
      }
      
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return fallback storage
    return fallbackStorage.slice(0, limit);
  }
}

