# PLIEGO — single free-tier image (API + SPA + Chromium for PDF)
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /fe
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm-slim AS backend-build
WORKDIR /be
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate && npm run build \
  && npm prune --omit=dev \
  && npm install --no-save tsx@4.23.13

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=45322 \
    PUBLIC_DIR=/app/public \
    UPLOAD_DIR=/app/uploads \
    EXPORT_DIR=/app/exports \
    DATABASE_URL=file:/app/data/pliego.db \
    CHROME_PATH=/usr/bin/chromium

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /app/data /app/uploads /app/exports /app/public

COPY --from=backend-build /be/package*.json ./
COPY --from=backend-build /be/node_modules ./node_modules
COPY --from=backend-build /be/dist ./dist
COPY --from=backend-build /be/prisma ./prisma
COPY --from=backend-build /be/src ./src
COPY --from=frontend-build /fe/dist ./public
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 45322
CMD ["/app/entrypoint.sh"]
