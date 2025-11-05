#!/bin/bash
# Migration helper script for Neon PostgreSQL
# Uses DIRECT_URL if available, otherwise falls back to DATABASE_URL

set -e

# Load .env file if it exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set"
  exit 1
fi

# Use DIRECT_URL for migrations if available (recommended for Neon)
# Otherwise use DATABASE_URL
MIGRATION_URL="${DIRECT_URL:-$DATABASE_URL}"

echo "Running migrations with connection string..."
echo "Note: Using ${DIRECT_URL:+DIRECT_URL}${DIRECT_URL:-DATABASE_URL}"

DATABASE_URL="$MIGRATION_URL" npx prisma migrate deploy

echo "Migrations completed successfully!"

