# syntax=docker/dockerfile:1

# ---- 1. Install dependencies (build tools only needed if better-sqlite3 must compile) ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2. Build the Next.js app as a standalone server ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Live domain for SEO links / sitemap (override with --build-arg or in docker-compose.yml)
ARG NEXT_PUBLIC_SITE_URL=https://www.growthme.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1 \
    BUILD_STANDALONE=1
RUN npm run build \
  # The build opens the database once; make sure nothing from data/ can reach the image
  && rm -rf .next/standalone/data .next/standalone/public/uploads

# ---- 3. Minimal runtime image ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Standalone server + static assets; no source code or dev dependencies
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Database, uploads, generated admin password and session secret live here (mount a volume)
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME ["/app/data"]

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/categories').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
