# Neon PostgreSQL Setup Guide

This guide will help you set up Neon PostgreSQL for free deployment.

## Step 1: Create Neon Account and Database

1. Go to [neon.tech](https://neon.tech) and sign up for a free account
2. Create a new project
3. Choose a name for your project (e.g., "reforge")
4. Select the region closest to your Vercel deployment region
5. Create the database

## Step 2: Get Connection Strings

Neon provides two connection strings:

### Pooled Connection (for runtime/serverless)

- Use this for `DATABASE_URL` in production (Vercel)
- Found in Dashboard → Connection Details → "Pooled connection"
- Format: `postgresql://user:password@host/dbname?sslmode=require`

### Direct Connection (for migrations)

- Use this for running migrations locally
- Found in Dashboard → Connection Details → "Direct connection"
- Can be stored as `DIRECT_URL` for migrations

## Step 3: Update Environment Variables

### Local `.env` file:

```bash
# Use pooled connection for runtime
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Optional: Direct connection for migrations (use pooled if not set)
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### Vercel Environment Variables:

1. Go to your Vercel project → Settings → Environment Variables
2. Add `DATABASE_URL` with the **pooled connection string** (required)
   - This is used for runtime connections
   - Apply to: Production, Preview, and Development environments
3. (Optional) Add `DIRECT_URL` with the **direct connection string**
   - Only needed if you want to run migrations via Vercel CI/CD
   - Apply to: Production, Preview, and Development environments

**Important:** After adding environment variables in Vercel, redeploy your application for changes to take effect.

## Step 4: Run Migrations

After setting up your Neon database:

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
# Option 1: Use migration helper (recommended - uses DIRECT_URL if available)
pnpm db:migrate:direct

# Option 2: Standard migration (uses DATABASE_URL)
pnpm db:migrate

# Optional: Seed the database
pnpm db:seed

# Optional: Open Prisma Studio to view data
pnpm db:studio
```

**Note:** For Neon, it's recommended to use `DIRECT_URL` for migrations. The migration helper script (`db:migrate:direct`) automatically uses `DIRECT_URL` if set, otherwise falls back to `DATABASE_URL`.

## Step 5: Verify Connection

Test the connection locally:

```bash
# Open Prisma Studio to view your database
pnpm db:studio

# Or test via Node.js REPL
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected!')).catch(e => console.error('Error:', e))"
```

Verify in your app by:

1. Starting the dev server: `pnpm dev`
2. Navigating to the app and testing database operations
3. Checking Vercel logs after deployment for any connection errors

## Step 6: Deploy to Vercel

After setting up Neon:

1. **Push your code** to GitHub (if not already done)
2. **Add environment variables** in Vercel dashboard:
   - `DATABASE_URL` (pooled connection)
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
3. **Deploy** - Vercel will automatically:
   - Run `pnpm install`
   - Run `prisma generate` (via postinstall script)
   - Build your Next.js app
4. **Run migrations** after first deployment:
   ```bash
   # Connect to your Vercel project and run migrations
   # Or use Vercel CLI:
   vercel env pull .env.local
   pnpm db:migrate:direct
   ```

## Quick Reference

### Database Scripts

- `pnpm db:migrate` - Run migrations (uses DATABASE_URL)
- `pnpm db:migrate:direct` - Run migrations with DIRECT_URL fallback (recommended for Neon)
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio GUI

### Connection Strings

- **Pooled**: `postgresql://...?sslmode=require` - Use for runtime (DATABASE_URL)
- **Direct**: `postgresql://...?sslmode=require` - Use for migrations (DIRECT_URL)

## Notes

- **Pooled connections** are recommended for serverless (Vercel) to avoid connection limits
- **Direct connections** are needed for some migration operations
- Neon free tier includes:
  - 3 projects
  - 0.5 GB storage
  - 100 compute hours/month
  - Automatic scaling to zero when inactive

## Troubleshooting

- If migrations fail, try using `DIRECT_URL` explicitly
- Ensure SSL is enabled (`?sslmode=require`)
- Check that your IP is not blocked (unlikely on free tier)
