# Padel League Tracker - Doubles Update

## Changes Made

The application has been updated to properly support **padel doubles matches** (2v2) and includes **edit/delete functionality** for correcting mistakes.

### 1. Database Schema Changes

**Updated Match Model:**
- Changed from single winner/loser to doubles format
- Now stores 4 player IDs per match:
  - `winner1Id` and `winner2Id` (winning team)
  - `loser1Id` and `loser2Id` (losing team)
- All relationships properly maintained with foreign keys

**Migration:**
- Database was reset to apply new schema
- All old test data was cleared
- New migration: `20260303135604_doubles_support`

### 2. Scoring System Updated

**Points Calculation (lib/scoring.ts):**
- Each player in winning team gets 3 points
- Each player in losing team gets 1 point
- Properly handles all 4 players per match
- Rankings still sort by points (desc), then name (asc)

### 3. API Endpoints Enhanced

**POST /api/matches** - Create Match
- Now requires 4 player IDs: winner1Id, winner2Id, loser1Id, loser2Id
- Validates all 4 players are different
- Returns match with all player details

**GET /api/matches/[id]** - Get Single Match
- Returns match with all 4 players populated

**PUT /api/matches/[id]** - Update Match
- Edit match details (players, date)
- Same validation as create

**DELETE /api/matches/[id]** - Delete Match
- Permanently removes match from database
- Updates standings automatically

### 4. UI Updates

#### Add Match Page (app/matches/new/page.tsx)
- **Winning Team Section** (green background)
  - Winner 1 dropdown
  - Winner 2 dropdown
- **Losing Team Section** (red background)
  - Loser 1 dropdown
  - Loser 2 dropdown
- Date picker (defaults to today)
- Validation: requires 4 different players
- Minimum 4 players needed to create a match

#### Match History Page (app/matches/page.tsx)
- Displays matches as cards with green (winners) and red (losers) sections
- Shows team pairings: "Player1 & Player2"
- **Edit button** - Navigate to edit page
- **Delete button** - Shows confirm/cancel buttons
- Two-step delete confirmation to prevent accidents

#### Edit Match Page (app/matches/[id]/edit/page.tsx)
- Pre-fills all fields with current match data
- Same layout as Add Match page
- Can update any player or date
- Cancel button to go back without saving

#### Leaderboard (Home Page)
- Automatically updates with new scoring
- Shows correct points for 4-player matches
- Time filters still work (month, quarter, year, all-time)

### 5. User Experience Improvements

**Visual Distinction:**
- Green backgrounds/borders for winning teams
- Red backgrounds/borders for losing teams
- Clear section headers

**Error Prevention:**
- Two-step confirmation before deleting
- Validation prevents duplicate players
- Clear error messages

**Easy Corrections:**
- Edit button on every match
- Can fix wrong player selections
- Can update match dates

## Testing the New Features

### Test Data Added:
- 6 players: Alice, Bob, Charlie, Diana, Eve, Frank
- 2 doubles matches created:
  1. Alice & Bob beat Charlie & Diana (Mar 3)
  2. Charlie & Eve beat Alice & Frank (Mar 2)

### Expected Standings:
- **Alice**: 4 points (1 win + 1 loss)
- **Bob**: 3 points (1 win)
- **Charlie**: 4 points (1 win + 1 loss)
- **Diana**: 1 point (1 loss)
- **Eve**: 3 points (1 win)
- **Frank**: 1 point (1 loss)

### Try These Actions:

1. **View Home Page**
   - See leaderboard with correct doubles scoring
   - Test time filters

2. **Add New Match**
   - Click "Add Match"
   - Select 4 different players
   - Try selecting same player twice (should show error)
   - Submit and see standings update

3. **Edit Match**
   - Go to "Match History"
   - Click "Edit" on any match
   - Change players or date
   - Save and verify changes

4. **Delete Match**
   - Go to "Match History"
   - Click "Delete" on a match
   - See confirm/cancel buttons
   - Cancel first to test
   - Delete again and confirm
   - Verify standings update

## Files Changed

### Database & Schema:
- `prisma/schema.prisma` - Updated Match model for doubles
- `prisma/migrations/20260303135604_doubles_support/` - New migration

### Backend:
- `lib/scoring.ts` - Updated calculations for 4 players
- `app/api/matches/route.ts` - Updated for doubles
- `app/api/matches/[id]/route.ts` - NEW: Edit/delete endpoints

### Frontend:
- `app/matches/new/page.tsx` - Updated form for 4 players
- `app/matches/page.tsx` - Added edit/delete buttons, updated display
- `app/matches/[id]/edit/page.tsx` - NEW: Edit match page

### Configuration:
- Tailwind downgraded to v3 for compatibility

## Technical Notes

### Why Database Reset?
- Changing from 2 players to 4 players per match requires schema migration
- Old match data format incompatible with new format
- Clean slate ensures data integrity

### Validation Logic:
```typescript
// All 4 players must be different
const playerIds = [winner1Id, winner2Id, loser1Id, loser2Id]
const uniquePlayerIds = new Set(playerIds)
if (uniquePlayerIds.size !== 4) {
  return error('All four players must be different')
}
```

### Delete Safety:
- Two-step confirmation prevents accidental deletions
- Click "Delete" → shows "Confirm" and "Cancel"
- Must click "Confirm" to actually delete

## Next Steps (Optional Enhancements)

1. **Match Details Page** - Show full match card view
2. **Bulk Import** - CSV upload for multiple matches
3. **Statistics** - Partnership stats (who plays well together)
4. **Head-to-Head** - Team vs team records
5. **Undo Delete** - Soft delete with restore option
6. **Match Notes** - Add comments/scores to matches
7. **Player Profiles** - Individual stats and history

## Deployment Notes

- All changes compatible with SQLite (local) and PostgreSQL (production)
- No additional dependencies required
- Existing deployment configuration still valid
- Just push to GitHub and Vercel will redeploy automatically
