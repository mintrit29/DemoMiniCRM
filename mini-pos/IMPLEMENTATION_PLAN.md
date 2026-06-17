# Implementation Plan - Mini POS

## Progress Tracking
- [x] Initial Project Setup (Next.js 14, Tailwind, Prisma)
- [x] Update Database Schema (ID Int, Enum DiscountType)
- [x] Helpers & Utils (Money format, Prisma client)
- [x] Product Management (CRUD API & UI)
- [x] POS Screen (Cart, Search, Discounts)
- [x] Checkout Logic (Transaction, Stock Validation)
- [x] Order History & Reports
- [x] Dockerization (Dockerfile, docker-compose.yml)
- [x] README & Final Testing

## Implementation Details
- **Tech Stack:** Next.js (App Router), SQLite, Prisma, Shadcn UI (Pastel Theme).
- **Core Logic:** Checkout must use Prisma transaction to prevent overselling.
- **Persistence:** SQLite file saved in `./data` folder and mounted via Docker volume.
