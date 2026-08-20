FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package configuration
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build & seed)
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and scripts
COPY . .

# Build TypeScript to dist
RUN npm run build

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Create local storage directories if they don't exist
RUN mkdir -p uploads storage/private/cv

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
