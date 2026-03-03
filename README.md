# Padel League Tracker

A web application to track padel match results for a weekly league with real-time standings and filtering by time period.

## Features

- **Player Management**: Add and manage players
- **Match Recording**: Record match results with winner/loser
- **Scoring System**: 3 points for win, 1 point for loss
- **Leaderboard**: View rankings filtered by month, quarter, year, or all-time
- **Match History**: View all recorded matches
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 16 (React) with App Router
- **Database**: SQLite (local development) / PostgreSQL (production)
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Deployment**: Vercel (free tier)

## Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Players
- `id`: Unique identifier
- `name`: Player name (unique)
- `createdAt`: Timestamp when player was created
- `updatedAt`: Timestamp when player was updated

### Matches
- `id`: Unique identifier
- `winnerId`: Reference to winning player
- `loserId`: Reference to losing player
- `playedAt`: Date when match was played
- `createdAt`: Timestamp when match was recorded
- `updatedAt`: Timestamp when match was updated

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add Vercel Postgres database:
   - Go to your project dashboard on vercel.com
   - Navigate to Storage tab
   - Create a new Postgres database
   - Connect it to your project

4. Update database connection:
   - Vercel will automatically set the `DATABASE_URL` environment variable
   - Update `prisma/schema.prisma` datasource to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. Run migrations on production:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub

2. Import project on Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. Add Vercel Postgres:
   - In project dashboard, go to Storage
   - Create Postgres database
   - Connect to project

4. Update schema for PostgreSQL (same as above)

5. Add build command to run migrations:
   - In project settings, update build command to:
   ```bash
   npx prisma generate && npx prisma migrate deploy && next build
   ```

## Project Structure

```
padel-league/
├── app/
│   ├── page.tsx              # Main leaderboard view
│   ├── layout.tsx            # Root layout
│   ├── players/
│   │   └── page.tsx          # Player management
│   ├── matches/
│   │   ├── page.tsx          # Match history
│   │   └── new/
│   │       └── page.tsx      # Add new match
│   └── api/
│       ├── players/
│       │   └── route.ts      # Player CRUD operations
│       └── matches/
│           └── route.ts      # Match CRUD operations
├── components/
│   ├── Leaderboard.tsx       # Main standings table
│   ├── TimeFilter.tsx        # Period selector
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── scoring.ts            # Scoring calculation logic
└── prisma/
    └── schema.prisma         # Database schema
```

## Usage

### Adding Players

1. Click "Manage Players" on the home page
2. Enter player name and click "Add Player"
3. Player will appear in the list

### Recording Matches

1. Click "Add Match" on the home page
2. Select winner from dropdown
3. Select loser from dropdown
4. Choose match date (defaults to today)
5. Click "Save Match"

### Viewing Standings

- Home page shows current standings
- Use filter buttons to view:
  - **Month**: Current month only
  - **Quarter**: Current quarter (Q1-Q4)
  - **Year**: Current year
  - **All-Time**: All matches ever played

### Match History

- Click "Match History" to view all matches
- Shows date, winner, and loser for each match
- Sorted by most recent first

## Scoring System

- **Win**: +3 points
- **Loss**: +1 point
- **Rankings**: Sorted by total points (descending), then alphabetically by name

## Free Tier Limits

### Vercel Free Tier
- Unlimited public repositories
- 100 GB bandwidth/month
- 100 hours serverless execution/month
- Custom domain support

### Vercel Postgres Free Tier
- 256 MB storage (plenty for small league)
- 60 hours compute time/month

## Development

### Running Prisma Studio

View and edit database records:
```bash
npx prisma studio
```

### Resetting Database

```bash
npx prisma migrate reset
```

### Updating Schema

1. Edit `prisma/schema.prisma`
2. Create migration:
```bash
npx prisma migrate dev --name migration_name
```

## Troubleshooting

### Node Version Issues

If you get Node version errors, ensure you're using Node.js 20.9.0 or higher:
```bash
node --version
```

You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:
```bash
nvm install 20
nvm use 20
```

### Database Connection Issues

Check that `.env` file exists and contains:
```
DATABASE_URL="file:./dev.db"
```

For production (PostgreSQL), Vercel will set this automatically.

## License

MIT
