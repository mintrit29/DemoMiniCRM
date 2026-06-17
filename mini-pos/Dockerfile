FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

ENV DATABASE_URL="file:/app/data/pos.db"

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "mkdir -p /app/data && npx prisma migrate deploy && npm run start"]
