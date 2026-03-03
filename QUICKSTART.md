# Quick Start Guide

## Local Development Setup

### 1. Install Node.js 20+

The project requires Node.js version 20.9.0 or higher.

#### Check Your Current Version
```bash
node --version
```

#### Install Node.js 20 Using nvm (Recommended)

If you don't have the correct Node version:

1. Install nvm (Node Version Manager):
   - **macOS/Linux**:
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     ```
   - **Windows**: Download from [nvm-windows](https://github.com/coreybutler/nvm-windows)

2. Install Node.js 20:
   ```bash
   nvm install 20
   nvm use 20
   ```

3. Verify installation:
   ```bash
   node --version  # Should show v20.x.x
   ```

### 2. Install Dependencies

```bash
cd padel-league
npm install
```

### 3. Set Up Database

```bash
# Generate Prisma client and run migrations
npx prisma migrate dev

# This creates:
# - SQLite database file (dev.db)
# - Database tables (Player, Match)
# - Prisma Client
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Application

#### Add Players
1. Click "Manage Players"
2. Add at least 2 players (e.g., "Alice", "Bob", "Charlie", "Diana")

#### Add Matches
1. Click "Add Match"
2. Select winner and loser
3. Choose date (or leave as today)
4. Submit

#### View Standings
1. Return to home page
2. See updated leaderboard with points
3. Test time filters: Month, Quarter, Year, All-Time

## Database Management

### View Database in Prisma Studio
```bash
npx prisma studio
```
This opens a web interface at http://localhost:5555 where you can view and edit database records.

### Reset Database
```bash
npx prisma migrate reset
```
This will delete all data and recreate tables.

### Add Seed Data (Optional)

Create a seed script to populate test data:

```bash
# Create seed file
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create players
  const alice = await prisma.player.create({ data: { name: 'Alice' } })
  const bob = await prisma.player.create({ data: { name: 'Bob' } })
  const charlie = await prisma.player.create({ data: { name: 'Charlie' } })
  const diana = await prisma.player.create({ data: { name: 'Diana' } })

  // Create matches
  await prisma.match.create({
    data: {
      winnerId: alice.id,
      loserId: bob.id,
      playedAt: new Date('2024-03-01')
    }
  })

  await prisma.match.create({
    data: {
      winnerId: alice.id,
      loserId: charlie.id,
      playedAt: new Date('2024-03-02')
    }
  })

  await prisma.match.create({
    data: {
      winnerId: bob.id,
      loserId: diana.id,
      playedAt: new Date('2024-03-03')
    }
  })

  console.log('Seed data created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOF

# Add seed script to package.json
npm pkg set prisma.seed="ts-node prisma/seed.ts"

# Install ts-node
npm install -D ts-node

# Run seed
npx prisma db seed
```

## Development Workflow

### Making Changes

1. **Edit Components** - Modify files in `components/`
2. **Edit Pages** - Modify files in `app/`
3. **Edit API Routes** - Modify files in `app/api/`
4. **Edit Styling** - Components use Tailwind CSS classes

The dev server will auto-reload on changes.

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```
3. Prisma Client will be regenerated automatically

## Project Structure

```
padel-league/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (leaderboard)
│   ├── layout.tsx         # Root layout
│   ├── players/
│   │   └── page.tsx       # Player management
│   ├── matches/
│   │   ├── page.tsx       # Match history
│   │   └── new/
│   │       └── page.tsx   # Add match form
│   └── api/               # API routes
│       ├── players/
│       │   └── route.ts   # Player endpoints
│       └── matches/
│           └── route.ts   # Match endpoints
├── components/            # React components
│   ├── Leaderboard.tsx   # Standings table
│   └── TimeFilter.tsx    # Period filter buttons
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   └── scoring.ts        # Scoring logic
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── public/               # Static files
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create and apply migration
npx prisma migrate reset # Reset database
npx prisma generate      # Regenerate Prisma Client
npx prisma db seed       # Run seed script

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to remote
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# If still issues, delete and reinstall
rm -rf node_modules
npm install
```

### Database Locked (SQLite)
```bash
# Close Prisma Studio and restart dev server
# Or delete dev.db and run migrations again
rm prisma/dev.db
npx prisma migrate dev
```

## Next Steps

Once you have the app running locally:

1. **Test all features** - Add players, record matches, check leaderboard
2. **Customize styling** - Edit Tailwind classes to match your preferences
3. **Deploy to Vercel** - Follow DEPLOYMENT.md guide
4. **Share with league** - Get feedback from users

## Need Help?

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vercel**: https://vercel.com/docs
