# /apps/frontend/Dockerfile
FROM node:20-alpine AS base-build
RUN apk update && apk add --no-cache libc6-compat

FROM node:20-alpine AS base-runner

FROM base-build AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=frontend --docker

FROM base-build AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g corepack@latest \
    && corepack enable \
    && corepack prepare pnpm@9.12.3 --activate

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN mkdir -p /app/apps/frontend/public

RUN pnpm build --filter=frontend

FROM base-runner AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=installer /app/apps/frontend/next.config.mjs .
COPY --from=installer /app/apps/frontend/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

CMD ["node", "apps/frontend/server.js"]