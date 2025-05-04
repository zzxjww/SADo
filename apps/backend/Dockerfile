FROM node:20-alpine AS base

# Install necessary dependencies in base image
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g pnpm@latest

FROM base AS builder
WORKDIR /app
# Install Turbo globally for monorepo management
RUN npm install -g turbo
COPY . .

# Prune the monorepo for backend package
RUN turbo prune backend --docker

FROM base AS installer
WORKDIR /app

# Copy pruned package.json and lockfile
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the source code
COPY --from=builder /app/out/full/ .

# Build the project
RUN pnpm turbo run build --filter=backend

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["node", "/app/apps/backend/dist/server.js"]