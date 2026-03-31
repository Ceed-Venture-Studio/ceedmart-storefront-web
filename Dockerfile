FROM node:20-alpine AS base

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

# Enable corepack for yarn 4
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# ---- Builder ----
FROM base AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.yarnrc.yml ./
COPY . .

# Build args → env vars for Next.js build (NEXT_PUBLIC_ vars are inlined at build time)
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=ng
ARG NEXT_PUBLIC_STRIPE_KEY
ARG NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID
ARG MEDUSA_BACKEND_URL
ARG REVALIDATE_SECRET

ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION
ENV NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY
ENV NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=$NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
ENV REVALIDATE_SECRET=$REVALIDATE_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
