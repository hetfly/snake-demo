# Snake Game with Leaderboard

A modern Snake game built with React, TypeScript, and Vite. Features include:
- Classic Snake gameplay
- Score tracking and leaderboard
- Multiple themes (light/dark)
- Responsive design
- Smooth animations

## Leaderboard Setup

The game includes a leaderboard feature that can use Supabase (free tier) for persistent storage, or fall back to in-memory storage if not configured.

### Option 1: Using Supabase (Recommended)

1. **Create a Supabase account** (free at [supabase.com](https://supabase.com))

2. **Create a new project** in your Supabase dashboard

3. **Create the leaderboard table**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL to create the table:
   ```sql
   CREATE TABLE leaderboard (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     player_name TEXT NOT NULL,
     score INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

   -- Create a policy that allows anyone to read and insert
   CREATE POLICY "Allow public read access" ON leaderboard
     FOR SELECT USING (true);

   CREATE POLICY "Allow public insert access" ON leaderboard
     FOR INSERT WITH CHECK (true);
   ```

4. **Get your API credentials**:
   - Go to Project Settings → API
   - Copy your "Project URL" and "anon/public" key

5. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Option 2: Without Supabase

If you don't configure Supabase, the leaderboard will work with in-memory storage. Scores will be lost when you refresh the page, but the feature will still function for testing.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

- Use arrow keys or WASD to control the snake
- Eat food to grow and increase your score
- Avoid hitting walls or yourself
- Submit your score to the leaderboard when the game ends
- View the leaderboard anytime by clicking the "Leaderboard" button

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
