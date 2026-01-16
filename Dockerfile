# ===============================
# 1️⃣ Builder
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files only (better cache)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Nuxt
RUN npm run build


# ===============================
# 2️⃣ Runner (production)
# ===============================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy build output only
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Install production deps only
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
