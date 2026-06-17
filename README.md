# Mini POS

Web app quản lý bán hàng cho cửa hàng nhỏ: quản lý sản phẩm, bán hàng, giảm giá, chốt đơn, trừ tồn kho, xem lịch sử đơn hàng và báo cáo doanh thu ngày.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- Docker / Docker Compose

## Chạy local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Mở `http://localhost:3000`.

## Chạy bằng Docker Compose

```bash
docker compose up --build
```

SQLite trong Docker dùng `DATABASE_URL="file:/app/data/pos.db"` và được mount ra thư mục `./data`, nên dữ liệu vẫn còn sau khi restart container.

## Reset database local

```bash
npx prisma migrate reset
```

## Tính năng đã hoàn thành

- Thêm, sửa, xóa sản phẩm với validation backend.
- Xem danh sách sản phẩm kèm tồn kho hiện tại.
- POS chọn nhiều sản phẩm, nhập số lượng và tìm kiếm sản phẩm.
- Tính tiền theo `giá x số lượng`.
- Giảm giá theo phần trăm hoặc số tiền.
- Chốt đơn bằng Prisma transaction.
- Backend chặn bán quá tồn kho và không tạo đơn lỗi.
- Tự động trừ tồn kho khi chốt đơn thành công.
- Lịch sử đơn hàng và chi tiết dòng hàng.
- Báo cáo doanh thu hôm nay.
- Dockerfile và docker-compose.yml với SQLite persistent storage.

## Token đã dùng

Ước tính đã dùng khoảng 1,000,000 tokens cho toàn bộ quá trình phát triển, sửa lỗi, tích hợp UI và kiểm thử.
