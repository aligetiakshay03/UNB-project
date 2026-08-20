#!/bin/sh
set -e

echo "===================================================="
echo "🚀 UNB Backend Container Starting..."
echo "===================================================="

# Ensure Prisma Client is generated
echo "⚙️ Generating Prisma Client..."
npx prisma generate

# Apply database schema to PostgreSQL
echo "📦 Pushing Database Schema..."
npx prisma db push --accept-data-loss

# Seed initial admin, editor, and category data
echo "🌱 Seeding Database..."
npx prisma db seed || true

echo "✨ Backend ready! Starting server on port ${PORT:-5000}..."
exec "$@"
