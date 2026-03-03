# Deployment Guide

This guide will walk you through deploying the Padel League Tracker to Vercel with a PostgreSQL database.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is sufficient)
- Node.js 20.9.0 or higher installed locally (for initial setup)

## Step 1: Push Code to GitHub

If you haven't already:

1. Initialize git repository (if not done):
```bash
git init
git add .
git commit -m "Initial commit: Padel League Tracker"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/padel-league.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Via Vercel Web Interface (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click "New Project"

3. Import your GitHub repository:
   - Select your GitHub account
   - Choose the `padel-league` repository
   - Click "Import"

4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave default or use `prisma generate && next build`
   - **Output Directory**: Leave default
   - **Install Command**: Leave default

5. Click "Deploy"
   - Initial deployment will succeed but the app won't work yet (no database)

## Step 3: Add PostgreSQL Database

1. In your Vercel project dashboard, click on the "Storage" tab

2. Click "Create Database"

3. Select "Postgres"

4. Choose a database name (e.g., `padel-league-db`)

5. Select region closest to your users

6. Click "Create"

7. Vercel will automatically:
   - Create the database
   - Add `DATABASE_URL` and other connection env vars to your project
   - Link the database to your project

## Step 4: Update Database Schema for PostgreSQL

Your code currently uses SQLite for local development. For production, you need PostgreSQL.

1. Update `prisma/schema.prisma`:
   - Change the provider from `sqlite` to `postgresql`
   - The file should look like:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Player {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  wonMatches Match[]  @relation("Winner")
  lostMatches Match[] @relation("Loser")
}

model Match {
  id        String   @id @default(uuid())
  winnerId  String
  loserId   String
  playedAt  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  winner    Player   @relation("Winner", fields: [winnerId], references: [id])
  loser     Player   @relation("Loser", fields: [loserId], references: [id])
}
```

2. Commit and push the change:
```bash
git add prisma/schema.prisma
git commit -m "Update schema for PostgreSQL"
git push
```

3. Vercel will automatically redeploy

## Step 5: Run Database Migrations

After the deployment completes, you need to run migrations to create the database tables.

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your local project to Vercel:
```bash
vercel link
```

3. Pull environment variables (including DATABASE_URL):
```bash
vercel env pull .env.production
```

4. Run migrations:
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard (Alternative)

1. Go to your project settings on Vercel

2. Navigate to "Settings" → "Environment Variables"

3. Copy the `DATABASE_URL` value

4. In your local terminal, set the DATABASE_URL:
```bash
export DATABASE_URL="<paste-the-database-url-here>"
```

5. Run migrations:
```bash
npx prisma migrate deploy
```

### Option C: Add Migration to Build Process (Automatic)

This approach runs migrations automatically on every deployment:

1. Update `package.json` build script:
```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

2. Commit and push:
```bash
git add package.json
git commit -m "Add automatic migrations to build"
git push
```

**Note**: This is included in the current setup, so migrations should run automatically.

## Step 6: Verify Deployment

1. Once deployment is complete, click "Visit" to open your app

2. You should see the Padel League Standings page

3. Test the functionality:
   - Click "Manage Players" and add a few players
   - Click "Add Match" and record some matches
   - Verify the leaderboard updates correctly
   - Test the time period filters (Month, Quarter, Year, All-Time)

## Step 7: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"

2. Click "Add Domain"

3. Enter your domain name

4. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails

**Error**: "Prisma Client could not be generated"
- **Solution**: Ensure `postinstall` script is in package.json:
  ```json
  "postinstall": "prisma generate"
  ```

**Error**: "Cannot find module '@prisma/client'"
- **Solution**: Add `prisma generate` to build command

### Database Connection Issues

**Error**: "Can't reach database server"
- **Solution**:
  1. Check that DATABASE_URL is set in Vercel environment variables
  2. Ensure database is linked to your project
  3. Try redeploying

**Error**: "Table doesn't exist"
- **Solution**: Run migrations using one of the methods in Step 5

### Application Errors

**Error**: 500 Internal Server Error on API routes
- **Solution**:
  1. Check Vercel function logs in the dashboard
  2. Ensure all environment variables are set
  3. Verify database migrations ran successfully

### Performance Issues

If you hit free tier limits:
- **Bandwidth**: 100 GB/month should be plenty for small leagues
- **Function Execution**: 100 hours/month
- **Database Storage**: 256 MB
- **Database Compute**: 60 hours/month

Consider upgrading to Pro if needed, or optimize queries.

## Maintenance

### Viewing Database

1. Install Prisma CLI globally:
```bash
npm i -g prisma
```

2. Pull production env vars:
```bash
vercel env pull .env.production
```

3. Open Prisma Studio:
```bash
npx dotenv -e .env.production -- npx prisma studio
```

### Backing Up Data

Use Vercel's database backup feature:
1. Go to Storage tab in Vercel
2. Select your database
3. Click "Backups"
4. Configure automatic backups

Or export data via Prisma Studio or SQL queries.

### Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: View function logs in Vercel dashboard
- **Errors**: Check Vercel's error reporting

## Next Steps

1. Add your league members as testers
2. Collect feedback on usability
3. Consider adding features like:
   - Player profiles
   - Head-to-head statistics
   - Export to CSV
   - Dark mode
   - Mobile app version

## Support

If you encounter issues:
1. Check Vercel's status page
2. Review deployment logs in Vercel dashboard
3. Check Prisma documentation for database issues
4. Review Next.js documentation for framework issues
