# PRD — Web App Quản Lý Bán Hàng Mini POS

## 1. Thông tin tài liệu

| Thuộc tính | Nội dung |
|---|---|
| Tên sản phẩm | Web App Quản Lý Bán Hàng Mini POS |
| Đối tượng sử dụng | Chủ cửa hàng nhỏ, một người dùng chính, vai trò Admin |
| Thời gian thực hiện | 2–3 ngày |
| Mục tiêu chính | Xây dựng web app POS chạy được thật, có quản lý sản phẩm, bán hàng, chặn bán quá tồn kho, báo cáo doanh thu và lưu trữ bền vững |
| Mức ưu tiên | MVP hoàn chỉnh, tập trung đúng nghiệp vụ lõi |
| Nền tảng triển khai | Docker, Docker Compose |

---

## 2. Bối cảnh và mục tiêu sản phẩm

Một cửa hàng nhỏ cần một ứng dụng bán hàng đơn giản để quản lý sản phẩm, tồn kho, tạo đơn hàng, trừ kho sau khi bán và xem lại doanh thu theo ngày. Người dùng chính là chủ cửa hàng, vừa thao tác bán hàng, vừa theo dõi báo cáo.

Sản phẩm phải là một web app chạy được thật, không phải code mẫu. Ứng dụng cần đáp ứng đầy đủ các tiêu chí nghiệm thu sau:

- Thêm, sửa, xóa sản phẩm.
- Xem danh sách sản phẩm kèm tồn kho hiện tại.
- Tạo đơn hàng với nhiều sản phẩm.
- Nhập số lượng cho từng sản phẩm trong đơn.
- Tự động tính tiền theo công thức `giá × số lượng`.
- Áp dụng giảm giá theo phần trăm hoặc số tiền.
- Tự động trừ tồn kho khi chốt đơn thành công.
- Chặn bán quá tồn kho, báo lỗi và không cho chốt đơn.
- Xem lịch sử đơn hàng.
- Báo cáo doanh thu theo ngày.
- Tải lại trang dữ liệu vẫn còn.
- Chạy được bằng một lệnh và có README hướng dẫn.

---

## 3. Phạm vi sản phẩm

### 3.1 In scope

Sản phẩm MVP bao gồm các module sau:

1. Dashboard tổng quan.
2. Quản lý sản phẩm.
3. Màn hình POS bán hàng.
4. Giỏ hàng và tính tiền.
5. Giảm giá theo phần trăm hoặc số tiền.
6. Chốt đơn hàng bằng transaction.
7. Kiểm tra và chặn bán quá tồn kho ở backend.
8. Tự động trừ tồn kho sau khi chốt đơn thành công.
9. Lịch sử đơn hàng.
10. Báo cáo doanh thu theo ngày hiện tại.
11. Lưu trữ dữ liệu bền vững bằng SQLite.
12. Dockerfile, Docker Compose và README hướng dẫn chạy.
13. Các yêu cầu bảo mật tối thiểu khi dùng AI coding và khi triển khai app.

### 3.2 Out of scope

Các tính năng sau không nằm trong MVP 2–3 ngày:

- Đa chi nhánh.
- Đa tài khoản, phân quyền phức tạp.
- Quản lý khách hàng.
- Quản lý nhà cung cấp.
- Nhập kho nâng cao.
- In hóa đơn qua máy in chuyên dụng.
- Quét mã vạch.
- Thanh toán online.
- Đồng bộ cloud.
- Báo cáo nâng cao theo tuần, tháng, biểu đồ phức tạp.
- Tích hợp kế toán.

---

## 4. Người dùng mục tiêu

### 4.1 Primary user

**Chủ cửa hàng nhỏ**

Đặc điểm:

- Một người sử dụng chính.
- Không cần quy trình phân quyền phức tạp.
- Cần thao tác bán hàng nhanh.
- Cần kiểm tra tồn kho đơn giản.
- Cần xem doanh thu trong ngày.
- Không có yêu cầu vận hành hệ thống phức tạp.

### 4.2 Nhu cầu chính

- Quản lý sản phẩm dễ dàng.
- Biết sản phẩm còn bao nhiêu tồn kho.
- Tạo đơn hàng nhanh khi khách mua nhiều món.
- Tránh bán âm kho.
- Biết hôm nay bán được bao nhiêu tiền.
- Dữ liệu không bị mất khi refresh hoặc restart container.

---

## 5. Nguyên tắc sản phẩm

1. **Đơn giản trước, đầy đủ nghiệp vụ lõi trước**  
   App phải dễ dùng, không tạo quá nhiều bước thao tác.

2. **Backend là nguồn sự thật**  
   Kiểm tra tồn kho, tính tiền và trừ kho phải xử lý ở backend. Frontend chỉ hỗ trợ trải nghiệm người dùng, không được là nơi quyết định cuối cùng.

3. **Không bán quá tồn kho**  
   Đây là nghiệp vụ quan trọng nhất. Nếu tồn kho không đủ, hệ thống phải chặn chốt đơn.

4. **Dữ liệu phải bền vững**  
   Dữ liệu sản phẩm, đơn hàng, tồn kho phải còn sau khi refresh trang hoặc restart container.

5. **Triển khai nhanh nhưng an toàn**  
   Stack phải tối ưu cho 2–3 ngày, nhưng vẫn cần validation, transaction, bảo mật secrets và không bỏ qua kiểm tra bảo mật tối thiểu.

---

## 6. Tech stack đề xuất

### 6.1 Frontend và Backend

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 14+ |
| Routing | App Router |
| Language | TypeScript |
| Backend interface | Route Handlers hoặc Server Actions |
| Runtime | Node.js 20+ |

Khuyến nghị dùng **Next.js App Router + TypeScript** để phát triển nhanh cả frontend và backend trong cùng một codebase.

### 6.2 UI

| Thành phần | Công nghệ |
|---|---|
| Styling | Tailwind CSS |
| Component library | Shadcn UI |
| Icon | lucide-react |
| Notification | Sonner hoặc Shadcn toast |

### 6.3 Database và ORM

| Thành phần | Công nghệ |
|---|---|
| Database | SQLite |
| ORM | Prisma |
| Storage | Một file SQLite được mount vào Docker volume |

SQLite phù hợp vì ứng dụng chỉ phục vụ một cửa hàng nhỏ, một người dùng chính và cần chạy nhanh trong môi trường Docker/local.

### 6.4 Đóng gói và triển khai

| Thành phần | Công nghệ |
|---|---|
| Container | Docker |
| Orchestration local | Docker Compose |
| Persistent storage | Docker volume hoặc bind mount thư mục `./data` |

---

## 7. Thiết kế UI/UX

### 7.1 Phong cách giao diện

Giao diện cần tối giản, rõ ràng, dễ nhìn và thân thiện với người không chuyên kỹ thuật.

Tone màu chủ đạo:

| Thành phần | Gợi ý màu |
|---|---|
| Background | `slate-50` |
| Card | `white`, border `slate-200` |
| Text chính | `slate-800` |
| Text phụ | `slate-500` |
| Primary action | Soft Blue |
| Success action | Mint / Emerald nhẹ |
| Danger action | Rose nhẹ |

Ví dụ Tailwind class:

```tsx
bg-slate-50 text-slate-800
bg-white border border-slate-200 rounded-2xl shadow-sm
bg-blue-100 text-blue-700 hover:bg-blue-200
bg-emerald-100 text-emerald-700 hover:bg-emerald-200
bg-rose-100 text-rose-700 hover:bg-rose-200
```

### 7.2 Điều hướng chính

Ứng dụng có thanh điều hướng gồm:

- Dashboard
- POS
- Sản phẩm
- Đơn hàng
- Báo cáo

Có thể dùng sidebar trên desktop và top navigation hoặc drawer trên mobile.

### 7.3 Toast notification

Dùng toast để thông báo nhanh:

| Trường hợp | Nội dung |
|---|---|
| Chốt đơn thành công | `Chốt đơn thành công` |
| Hết hàng / không đủ tồn | `Không đủ tồn kho để chốt đơn` |
| Thêm sản phẩm thành công | `Thêm sản phẩm thành công` |
| Cập nhật sản phẩm thành công | `Cập nhật sản phẩm thành công` |
| Xóa sản phẩm thành công | `Xóa sản phẩm thành công` |
| Dữ liệu không hợp lệ | `Vui lòng kiểm tra lại thông tin nhập` |
| Giỏ hàng rỗng | `Giỏ hàng đang trống` |

---

## 8. Cấu trúc thông tin và route

| Route | Mục đích |
|---|---|
| `/` | Dashboard tổng quan |
| `/pos` | Màn hình bán hàng chính |
| `/products` | Quản lý sản phẩm |
| `/orders` | Lịch sử đơn hàng |
| `/reports` | Báo cáo doanh thu |

---

## 9. Database schema

### 9.1 Mô hình dữ liệu bắt buộc

Theo yêu cầu đề bài, database cần tối thiểu 3 bảng chính:

1. `Product`
2. `Order`
3. `OrderItem`

Quan hệ:

```text
Product 1 --- n OrderItem n --- 1 Order
```

Một đơn hàng có nhiều dòng sản phẩm. Một sản phẩm có thể xuất hiện trong nhiều đơn hàng.

### 9.2 Bảng Product

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| id | Int | Có | Primary key, auto increment |
| name | String | Có | Tên sản phẩm |
| price | Int | Có | Giá bán, đơn vị VND |
| stock | Int | Có | Số lượng tồn kho hiện tại |
| createdAt | DateTime | Có | Thời điểm tạo |
| updatedAt | DateTime | Có | Thời điểm cập nhật |

Validation:

- `name` không được rỗng.
- `price >= 0`.
- `stock >= 0`.
- `stock` phải là số nguyên.

### 9.3 Bảng Order

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| id | Int | Có | Primary key, auto increment |
| totalAmount | Int | Có | Tổng tiền trước giảm giá |
| discountType | String / Enum | Không | `PERCENT` hoặc `AMOUNT` |
| discountValue | Int | Có | Giá trị giảm giá do người dùng nhập |
| discountAmount | Int | Có | Số tiền giảm thực tế sau khi tính |
| finalAmount | Int | Có | Số tiền cuối cùng phải trả |
| createdAt | DateTime | Có | Thời điểm tạo đơn |

### 9.4 Bảng OrderItem

| Field | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| id | Int | Có | Primary key, auto increment |
| orderId | Int | Có | Foreign key đến Order |
| productId | Int | Có | Foreign key đến Product |
| quantity | Int | Có | Số lượng bán |
| unitPrice | Int | Có | Giá tại thời điểm bán |
| lineTotal | Int | Có | `quantity × unitPrice` |

### 9.5 Prisma schema đề xuất

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Int
  stock     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orderItems OrderItem[]

  @@index([name])
}

model Order {
  id             Int           @id @default(autoincrement())
  totalAmount    Int
  discountType   DiscountType?
  discountValue  Int           @default(0)
  discountAmount Int           @default(0)
  finalAmount    Int
  createdAt      DateTime      @default(now())

  items OrderItem[]
}

model OrderItem {
  id        Int @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  unitPrice Int
  lineTotal Int

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

enum DiscountType {
  PERCENT
  AMOUNT
}
```

### 9.6 Quy ước lưu tiền

Toàn bộ giá tiền lưu bằng `Int`, đơn vị VND.

Không dùng `Float` cho tiền để tránh sai số làm tròn.

---

## 10. Module Dashboard

### 10.1 Mục tiêu

Dashboard giúp chủ cửa hàng nhìn nhanh tình hình bán hàng và tồn kho.

### 10.2 Nội dung hiển thị

- Doanh thu hôm nay.
- Số đơn hôm nay.
- Tổng số sản phẩm.
- Số sản phẩm tồn kho thấp.
- Nút truy cập nhanh đến POS và quản lý sản phẩm.

### 10.3 Acceptance criteria

- Dashboard hiển thị đúng doanh thu hôm nay.
- Dashboard hiển thị đúng số đơn hôm nay.
- Dashboard hiển thị đúng số lượng sản phẩm.
- Dashboard có đường dẫn nhanh đến màn hình POS.

---

## 11. Module Quản lý sản phẩm

### 11.1 Route

```text
/products
```

### 11.2 Mục tiêu

Cho phép chủ cửa hàng quản lý danh sách sản phẩm và tồn kho hiện tại.

### 11.3 Chức năng

#### 11.3.1 Xem danh sách sản phẩm

Bảng sản phẩm hiển thị:

- ID.
- Tên sản phẩm.
- Giá bán.
- Số lượng tồn kho.
- Thời điểm cập nhật.
- Hành động: sửa, xóa.

#### 11.3.2 Thêm sản phẩm

Form thêm sản phẩm gồm:

- Tên sản phẩm.
- Giá bán.
- Số lượng tồn kho.

Validation:

- Tên sản phẩm không được rỗng.
- Giá bán phải lớn hơn hoặc bằng 0.
- Tồn kho phải lớn hơn hoặc bằng 0.
- Giá bán và tồn kho phải là số hợp lệ.

#### 11.3.3 Sửa sản phẩm

Cho phép sửa:

- Tên sản phẩm.
- Giá bán.
- Số lượng tồn kho.

Sau khi sửa, danh sách sản phẩm phải cập nhật đúng.

#### 11.3.4 Xóa sản phẩm

Cho phép xóa sản phẩm.

Lưu ý triển khai:

- Với MVP, có thể cho phép xóa sản phẩm nếu không phá vỡ lịch sử đơn hàng.
- Nếu sản phẩm đã xuất hiện trong đơn hàng, ưu tiên không hard delete. Có thể dùng cơ chế `isActive` để ẩn sản phẩm khỏi POS nhưng vẫn giữ lịch sử.
- Nếu không thêm `isActive`, cần đảm bảo xóa sản phẩm không làm mất khả năng xem lịch sử đơn hàng cũ. `OrderItem.unitPrice` và thông tin dòng đơn phải vẫn hiển thị được.

### 11.4 Acceptance criteria

- Thêm được sản phẩm mới.
- Sửa được sản phẩm.
- Xóa được sản phẩm.
- Danh sách sản phẩm hiển thị đúng tồn kho hiện tại.
- Tồn kho cập nhật đúng sau khi chốt đơn bán hàng.

---

## 12. Module POS bán hàng

### 12.1 Route

```text
/pos
```

### 12.2 Mục tiêu

Màn hình POS là nghiệp vụ chính của sản phẩm. Chủ cửa hàng dùng màn hình này để chọn nhiều sản phẩm, nhập số lượng, áp dụng giảm giá và chốt đơn.

### 12.3 Layout desktop-first

Desktop chia 2 cột:

```text
┌────────────────────────────────────┬────────────────────────────────┐
│ Danh sách sản phẩm                  │ Giỏ hàng                        │
│ - Thanh tìm kiếm                    │ - Sản phẩm đã chọn              │
│ - Danh sách sản phẩm                │ - Số lượng                      │
│ - Nút thêm vào giỏ                  │ - Tổng tiền                     │
│                                     │ - Giảm giá                      │
│                                     │ - Thành tiền cuối               │
│                                     │ - Nút chốt đơn                  │
└────────────────────────────────────┴────────────────────────────────┘
```

Mobile layout:

- Danh sách sản phẩm nằm phía trên.
- Giỏ hàng nằm phía dưới.
- Nút chốt đơn dễ bấm, ưu tiên sticky ở cuối khu vực giỏ hàng.

### 12.4 Danh sách sản phẩm trong POS

Mỗi sản phẩm hiển thị:

- Tên sản phẩm.
- Giá bán.
- Tồn kho hiện tại.
- Nút `Thêm vào giỏ`.

Có thanh tìm kiếm sản phẩm theo tên.

### 12.5 Logic thêm vào giỏ

Khi người dùng bấm `Thêm vào giỏ`:

- Nếu sản phẩm chưa có trong giỏ, thêm với `quantity = 1`.
- Nếu sản phẩm đã có trong giỏ, tăng `quantity` thêm 1.
- Nếu số lượng trong giỏ đã bằng tồn kho, không cho tăng tiếp và hiển thị toast lỗi.

Toast lỗi đề xuất:

```text
Không thể thêm. Số lượng trong giỏ đã bằng tồn kho.
```

### 12.6 Giỏ hàng

Mỗi dòng giỏ hàng hiển thị:

- Tên sản phẩm.
- Đơn giá.
- Số lượng.
- Thành tiền.
- Nút xóa khỏi giỏ.

Người dùng có thể:

- Tăng số lượng.
- Giảm số lượng.
- Nhập trực tiếp số lượng.
- Xóa sản phẩm khỏi giỏ.
- Xóa toàn bộ giỏ hàng.

### 12.7 Validation số lượng trong giỏ

- Quantity phải là số nguyên.
- Quantity phải lớn hơn hoặc bằng 1.
- Quantity không được vượt quá tồn kho hiện tại.
- Nếu nhập quá tồn kho, hiển thị toast lỗi và đưa về số lượng tối đa có thể bán.

Lưu ý: frontend được phép chặn sớm để cải thiện UX, nhưng backend vẫn bắt buộc kiểm tra lại khi chốt đơn.

### 12.8 Tính tiền

Công thức:

```ts
lineTotal = quantity * unitPrice
totalAmount = sum(lineTotal)
```

Hiển thị:

- Tổng tiền trước giảm.
- Giá trị giảm giá.
- Thành tiền cuối cùng.

---

## 13. Giảm giá

### 13.1 Loại giảm giá

Ứng dụng hỗ trợ 2 loại giảm giá:

1. Giảm theo phần trăm.
2. Giảm theo số tiền trực tiếp.

### 13.2 UI giảm giá

Khu vực giảm giá gồm:

- Dropdown chọn loại giảm giá: `Không giảm`, `%`, `Số tiền`.
- Input nhập giá trị giảm.
- Hiển thị số tiền giảm thực tế.
- Hiển thị số tiền cuối cùng phải trả.

### 13.3 Logic tính giảm giá

Không giảm:

```ts
discountAmount = 0
```

Giảm theo phần trăm:

```ts
discountAmount = Math.floor(totalAmount * discountValue / 100)
```

Giảm theo số tiền:

```ts
discountAmount = discountValue
```

Thành tiền cuối:

```ts
finalAmount = Math.max(totalAmount - discountAmount, 0)
```

### 13.4 Validation giảm giá

| Loại giảm giá | Rule |
|---|---|
| Không giảm | `discountValue = 0` |
| Phần trăm | `0 <= discountValue <= 100` |
| Số tiền | `0 <= discountValue <= totalAmount` |

### 13.5 Acceptance criteria

- Giảm giá theo phần trăm tính đúng.
- Giảm giá theo số tiền tính đúng.
- Không cho giảm giá làm `finalAmount` âm.
- Số tiền cuối cùng hiển thị rõ trước khi chốt đơn.

---

## 14. Chốt đơn hàng và quản lý tồn kho

### 14.1 Đây là nghiệp vụ quan trọng nhất

Khi bấm `Chốt đơn`, hệ thống phải kiểm tra tồn kho thật trong database. Nếu bất kỳ sản phẩm nào trong giỏ hàng có số lượng yêu cầu lớn hơn tồn kho hiện tại, hệ thống phải báo lỗi và không được tạo đơn.

Không được chỉ kiểm tra ở frontend.

### 14.2 Request chốt đơn đề xuất

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "discountType": "PERCENT",
  "discountValue": 10
}
```

### 14.3 Quy trình backend bắt buộc

Khi nhận request chốt đơn, backend xử lý theo thứ tự:

1. Kiểm tra giỏ hàng không rỗng.
2. Kiểm tra từng item có `productId` và `quantity` hợp lệ.
3. Lấy danh sách sản phẩm hiện tại từ database.
4. Kiểm tra sản phẩm có tồn tại không.
5. Kiểm tra tồn kho hiện tại có đủ không.
6. Nếu thiếu tồn kho:
   - Trả lỗi.
   - Không tạo `Order`.
   - Không tạo `OrderItem`.
   - Không trừ kho.
7. Nếu đủ tồn kho:
   - Tính `totalAmount` ở backend.
   - Tính `discountAmount` ở backend.
   - Tính `finalAmount` ở backend.
   - Tạo `Order`.
   - Tạo các `OrderItem`.
   - Trừ tồn kho từng sản phẩm.
8. Trả kết quả thành công về frontend.
9. Frontend clear giỏ hàng và hiển thị toast thành công.

### 14.4 Bắt buộc dùng transaction

Toàn bộ quy trình tạo đơn và trừ kho phải chạy trong một Prisma transaction.

```ts
await prisma.$transaction(async (tx) => {
  // 1. Validate cart
  // 2. Load products
  // 3. Check stock
  // 4. Calculate money
  // 5. Create order
  // 6. Create order items
  // 7. Update product stock
})
```

### 14.5 Response lỗi tồn kho đề xuất

```json
{
  "message": "Không đủ tồn kho",
  "errors": [
    {
      "productId": 1,
      "productName": "Mì gói",
      "requested": 10,
      "available": 5
    }
  ]
}
```

Toast lỗi đề xuất:

```text
Mì gói chỉ còn 5 sản phẩm. Không thể chốt đơn.
```

### 14.6 Acceptance criteria

- Chốt đơn thành công khi tất cả sản phẩm đủ tồn kho.
- Khi chốt đơn thành công, tồn kho giảm đúng theo số lượng bán.
- Khi một sản phẩm không đủ tồn kho, đơn hàng bị chặn.
- Khi bị chặn vì thiếu tồn kho, database không thay đổi.
- Không có trường hợp bán âm kho.
- `OrderItem.unitPrice` lưu giá tại thời điểm bán.

---

## 15. Module Lịch sử đơn hàng

### 15.1 Route

```text
/orders
```

### 15.2 Mục tiêu

Cho phép chủ cửa hàng xem lại các đơn hàng đã bán.

### 15.3 Danh sách đơn hàng

Hiển thị:

- Mã đơn.
- Thời gian tạo đơn.
- Tổng tiền trước giảm.
- Loại giảm giá.
- Số tiền giảm.
- Số tiền cuối cùng.
- Tổng số lượng sản phẩm trong đơn.
- Nút xem chi tiết.

### 15.4 Chi tiết đơn hàng

Có thể hiển thị bằng modal, drawer hoặc expandable row.

Thông tin chi tiết:

- Tên sản phẩm.
- Số lượng.
- Đơn giá tại thời điểm bán.
- Thành tiền dòng.

### 15.5 Acceptance criteria

- Đơn hàng mới chốt xuất hiện trong lịch sử.
- Lịch sử sắp xếp đơn mới nhất lên đầu.
- Chi tiết đơn hàng hiển thị đúng sản phẩm, số lượng, đơn giá và thành tiền.
- Giá trong lịch sử không bị thay đổi khi giá sản phẩm hiện tại bị sửa.

---

## 16. Module Báo cáo doanh thu

### 16.1 Route

```text
/reports
```

### 16.2 Mục tiêu

Chủ cửa hàng xem được doanh thu bán hàng trong ngày.

### 16.3 Báo cáo MVP bắt buộc

- Doanh thu hôm nay.
- Số đơn hôm nay.
- Tổng số sản phẩm đã bán hôm nay.

### 16.4 Công thức

Doanh thu hôm nay:

```ts
todayRevenue = sum(order.finalAmount)
```

Số đơn hôm nay:

```ts
todayOrderCount = count(order.id)
```

Sản phẩm đã bán hôm nay:

```ts
todaySoldItems = sum(orderItem.quantity)
```

Chỉ tính các đơn có `createdAt` nằm trong ngày hiện tại theo timezone cấu hình của app.

### 16.5 UI báo cáo

Hiển thị dạng card:

```text
Doanh thu hôm nay: 1.250.000 ₫
Số đơn hôm nay: 18
Sản phẩm đã bán: 42
```

### 16.6 Acceptance criteria

- Doanh thu ngày tính đúng theo `finalAmount`.
- Chỉ tính đơn hàng trong ngày hiện tại.
- Sau khi chốt đơn mới, refresh báo cáo thấy số liệu mới.
- Số đơn hôm nay và số sản phẩm đã bán hôm nay tính đúng.

---

## 17. API specification

Có thể dùng Route Handlers trong Next.js App Router. API dưới đây là cấu trúc đề xuất để rõ ràng và dễ test.

### 17.1 Products API

#### GET `/api/products`

Mục đích: lấy danh sách sản phẩm.

Query optional:

```text
?search=keyword
```

Response:

```json
[
  {
    "id": 1,
    "name": "Mì gói",
    "price": 5000,
    "stock": 10,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
]
```

#### POST `/api/products`

Mục đích: tạo sản phẩm.

Request:

```json
{
  "name": "Sữa tươi",
  "price": 12000,
  "stock": 30
}
```

#### PATCH `/api/products/:id`

Mục đích: cập nhật sản phẩm.

Request:

```json
{
  "name": "Sữa tươi ít đường",
  "price": 13000,
  "stock": 25
}
```

#### DELETE `/api/products/:id`

Mục đích: xóa sản phẩm.

### 17.2 Orders API

#### GET `/api/orders`

Mục đích: lấy lịch sử đơn hàng, sắp xếp mới nhất trước.

#### POST `/api/orders`

Mục đích: chốt đơn.

Request:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "discountType": "PERCENT",
  "discountValue": 10
}
```

Response thành công:

```json
{
  "id": 12,
  "totalAmount": 50000,
  "discountType": "PERCENT",
  "discountValue": 10,
  "discountAmount": 5000,
  "finalAmount": 45000,
  "createdAt": "2026-01-01T10:00:00.000Z"
}
```

Response thất bại vì thiếu tồn kho:

```json
{
  "message": "Không đủ tồn kho",
  "errors": [
    {
      "productId": 1,
      "productName": "Mì gói",
      "requested": 10,
      "available": 5
    }
  ]
}
```

### 17.3 Reports API

#### GET `/api/reports/today`

Mục đích: lấy báo cáo doanh thu trong ngày.

Response:

```json
{
  "revenue": 1250000,
  "orderCount": 18,
  "soldItems": 42
}
```

---

## 18. Security requirements

Phần này là yêu cầu bắt buộc để giảm rủi ro bảo mật khi dùng AI coding và khi triển khai sản phẩm.

### 18.1 Nguyên tắc bảo mật bắt buộc

| Nhóm | Yêu cầu |
|---|---|
| Secrets | Tất cả secrets phải nằm trong `.env`, không hardcode trong source code |
| Git | File `.env` phải được thêm vào `.gitignore` ngay từ đầu |
| Validation | Validate toàn bộ input từ người dùng ở cả frontend và backend |
| Sanitization | Sanitize dữ liệu text trước khi render nếu có nguy cơ XSS |
| Database | Dùng Prisma ORM hoặc parameterized queries, không tự nối chuỗi SQL |
| Error handling | Không trả stack trace hoặc thông tin nội bộ ra client ở production |
| Logging | Không log secrets, token, thông tin nhạy cảm hoặc payload không cần thiết |
| Dependency | Chạy `npm audit` và xử lý lỗ hổng nghiêm trọng trước khi nộp/chạy production |
| Review | Review thủ công các phần liên quan đến auth, input, database transaction và Docker |
| Malicious input | Test với input bất thường như ký tự script, số âm, số rất lớn, chuỗi rỗng |

### 18.2 Những việc phải làm

- Dùng `.env` cho tất cả biến cấu hình, kể cả `DATABASE_URL`.
- Thêm `.env` vào `.gitignore` ngay từ đầu.
- Cung cấp `.env.example` không chứa secret thật.
- Validate input sản phẩm: tên, giá, tồn kho.
- Validate input giỏ hàng: productId, quantity.
- Validate input giảm giá: loại giảm giá và giá trị giảm.
- Tính tiền ở backend, không tin tuyệt đối vào dữ liệu tiền từ frontend gửi lên.
- Kiểm tra tồn kho ở backend ngay trong transaction.
- Sử dụng Prisma để giảm rủi ro SQL injection.
- Escape hoặc sanitize dữ liệu người dùng trước khi hiển thị nếu có HTML/custom rendering.
- Không expose thông tin dư thừa trong API response.
- Chạy kiểm tra dependency trước khi hoàn tất:

```bash
npm audit
```

- Test các input có khả năng gây lỗi:

```text
<script>alert(1)</script>
-1
0
999999999999
Chuỗi rỗng
Sản phẩm không tồn tại
Quantity vượt tồn kho
```

### 18.3 Những việc không được làm

- Không hardcode API key, token, password hoặc secret trong code.
- Không commit file `.env` lên Git.
- Không bỏ qua input validation.
- Không chỉ kiểm tra tồn kho ở frontend.
- Không tự nối chuỗi SQL từ input người dùng.
- Không log dữ liệu nhạy cảm.
- Không deploy khi chưa review bảo mật tối thiểu.
- Không bỏ qua dependency vulnerabilities nghiêm trọng.
- Không để AI tự thiết kế custom crypto/encryption nếu không có review chuyên môn.
- Không dùng lệnh nguy hiểm trong quá trình AI coding như `rm -rf`, `git reset --hard`, `git push --force` nếu chưa được kiểm soát.

### 18.4 Rủi ro bảo mật cần kiểm soát

| Rủi ro | Mô tả | Cách kiểm soát trong sản phẩm |
|---|---|---|
| Lộ API keys / secrets | Secret bị hardcode hoặc commit lên Git | Dùng `.env`, `.env.example`, `.gitignore` |
| SQL injection | Input người dùng bị dùng trực tiếp trong query | Dùng Prisma ORM, không raw query nếu không cần |
| XSS | Tên sản phẩm chứa script hoặc HTML độc hại | Render text an toàn, không dùng `dangerouslySetInnerHTML` |
| Command injection | User input bị đưa vào command shell | Không chạy shell command từ input người dùng |
| Auth weakness | Nếu sau này thêm auth nhưng xử lý yếu | MVP single admin; nếu thêm auth phải review thủ công |
| Data exposure | API trả dữ liệu dư thừa hoặc lỗi lộ stack trace | Response tối thiểu, lỗi production dạng an toàn |
| Business logic bypass | Frontend bị sửa để gửi quantity vượt tồn | Backend bắt buộc kiểm tra tồn kho trong transaction |
| Race condition tồn kho | Hai request đồng thời có thể làm sai tồn kho | Dùng transaction và update tồn kho có kiểm soát |
| Dependency vulnerabilities | Package có lỗ hổng bảo mật | Chạy `npm audit`, cập nhật package nghiêm trọng |

### 18.5 Security checklist trước khi hoàn tất

Trước khi nộp hoặc deploy, cần tick đủ:

- [ ] `.env` không nằm trong Git.
- [ ] `.env.example` có đủ biến cần thiết nhưng không chứa secret thật.
- [ ] Không có API key, token, password hardcode trong source code.
- [ ] Tất cả API create/update/order đều validate input.
- [ ] Không có raw SQL nối chuỗi từ input người dùng.
- [ ] Backend kiểm tra tồn kho trước khi tạo đơn.
- [ ] Chốt đơn dùng transaction.
- [ ] Không log payload nhạy cảm.
- [ ] Không expose stack trace ở production.
- [ ] Đã chạy `npm audit`.
- [ ] Đã test input bất thường và malicious input cơ bản.
- [ ] Đã review các thay đổi do AI sinh ra trước khi chạy production.

### 18.6 Cấu hình an toàn khi dùng Claude Code / AI coding

Trong workspace nên có file setting quyền lệnh cho AI coding assistant theo hướng chỉ cho phép thao tác Git an toàn và chặn lệnh nguy hiểm.

Nội dung setting tham khảo:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ],
    "deny": [
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

Ghi chú:

- Setting này không phải tính năng người dùng cuối, nhưng là yêu cầu an toàn trong quá trình build sản phẩm bằng AI.
- Không cho AI tự ý xóa thư mục, reset Git hoặc force push.
- Tất cả thay đổi lớn phải được review bằng `git diff` trước khi commit.

---

## 19. Non-functional requirements

### 19.1 Performance

- App phục vụ tốt cho cửa hàng nhỏ với vài trăm đến vài nghìn sản phẩm.
- Search sản phẩm có thể chạy client-side với dữ liệu nhỏ.
- API danh sách sản phẩm nên sắp xếp ổn định theo tên hoặc thời gian tạo.

### 19.2 Reliability

- Chốt đơn và trừ kho phải là thao tác atomic.
- Nếu transaction lỗi, không được tạo dữ liệu nửa vời.
- Restart container không làm mất database.

### 19.3 Maintainability

- Code TypeScript rõ ràng.
- Tách helper tính tiền, format tiền, validation.
- Không duplicate logic tính tiền giữa nhiều nơi mà không kiểm soát.
- Có README hướng dẫn chạy local và Docker.

### 19.4 Usability

- Chủ cửa hàng không cần hiểu kỹ thuật vẫn thao tác được.
- Button chính rõ ràng.
- Lỗi cần hiển thị dễ hiểu bằng tiếng Việt.
- Tồn kho phải hiển thị ngay trên danh sách sản phẩm.

---

## 20. Cấu trúc thư mục đề xuất

```text
mini-pos/
├── app/
│   ├── page.tsx
│   ├── pos/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── products/[id]/
│   │   │   └── route.ts
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── reports/today/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── app-nav.tsx
│   ├── product-form.tsx
│   ├── product-table.tsx
│   ├── pos-product-list.tsx
│   ├── cart-panel.tsx
│   ├── order-history-table.tsx
│   └── revenue-card.tsx
├── lib/
│   ├── prisma.ts
│   ├── money.ts
│   ├── validation.ts
│   └── date.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── data/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── README.md
├── package.json
└── next.config.js
```

---

## 21. Helper bắt buộc

### 21.1 Format tiền VND

```ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}
```

### 21.2 Tính tiền đơn hàng

```ts
type DiscountType = "PERCENT" | "AMOUNT" | null;

export function calculateOrderAmount(params: {
  items: Array<{ quantity: number; unitPrice: number }>;
  discountType?: DiscountType;
  discountValue?: number;
}) {
  const totalAmount = params.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  let discountAmount = 0;

  if (params.discountType === "PERCENT") {
    discountAmount = Math.floor(totalAmount * (params.discountValue ?? 0) / 100);
  }

  if (params.discountType === "AMOUNT") {
    discountAmount = params.discountValue ?? 0;
  }

  discountAmount = Math.min(Math.max(discountAmount, 0), totalAmount);

  return {
    totalAmount,
    discountAmount,
    finalAmount: totalAmount - discountAmount,
  };
}
```

---

## 22. Docker và triển khai

### 22.1 Yêu cầu

- App chạy được bằng một lệnh Docker Compose.
- SQLite database được lưu bền vững.
- Restart container không làm mất dữ liệu.
- README có hướng dẫn rõ ràng.

### 22.2 Biến môi trường

`.env.example`:

```env
DATABASE_URL="file:./dev.db"
```

Trong Docker Compose:

```env
DATABASE_URL="file:/app/data/pos.db"
```

### 22.3 Dockerfile đề xuất

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
```

### 22.4 docker-compose.yml đề xuất

```yaml
services:
  mini-pos:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mini-pos
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "file:/app/data/pos.db"
      NODE_ENV: "production"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### 22.5 README phải có

README cần có tối thiểu:

1. Mô tả ngắn sản phẩm.
2. Tech stack.
3. Cách chạy local.
4. Cách chạy bằng Docker Compose.
5. Cách reset database nếu cần.
6. Danh sách tính năng đã hoàn thành.
7. Ghi chú về dữ liệu SQLite được persist trong thư mục `./data`.

Lệnh chạy local:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Lệnh chạy Docker:

```bash
docker-compose up --build
```

---

## 23. Kế hoạch triển khai 2–3 ngày

### Ngày 1 — Setup nền tảng và CRUD sản phẩm

Mục tiêu:

- Khởi tạo project.
- Hoàn thiện database schema.
- Làm xong quản lý sản phẩm.

Công việc:

- Tạo Next.js 14+ App Router project với TypeScript.
- Cài Tailwind CSS và Shadcn UI.
- Cài Prisma và SQLite.
- Tạo schema `Product`, `Order`, `OrderItem`.
- Tạo migration.
- Tạo Prisma client.
- Build layout chính.
- Build trang `/products`.
- Build API CRUD sản phẩm.
- Thêm toast notification.
- Thêm `.env.example` và `.gitignore`.

Kết quả cuối ngày:

- App chạy local.
- Thêm/sửa/xóa/xem sản phẩm hoạt động.
- Dữ liệu sản phẩm lưu vào SQLite.

### Ngày 2 — POS, giỏ hàng và chốt đơn

Mục tiêu:

- Hoàn thiện nghiệp vụ bán hàng chính.
- Chặn bán quá tồn kho.
- Trừ tồn kho sau khi chốt đơn.

Công việc:

- Build màn hình `/pos` desktop-first split screen.
- Build search sản phẩm.
- Build cart state.
- Build tăng/giảm/nhập số lượng.
- Build logic tính tiền.
- Build logic giảm giá.
- Build API `POST /api/orders`.
- Implement transaction kiểm tra tồn kho.
- Implement tạo `Order` và `OrderItem`.
- Implement trừ tồn kho.
- Toast success/error.
- Test case bán quá tồn kho.

Kết quả cuối ngày:

- Có thể tạo đơn hàng với nhiều sản phẩm.
- Tính tiền đúng.
- Giảm giá đúng.
- Chốt đơn xong tồn kho giảm đúng.
- Bán quá tồn kho bị chặn và không thay đổi database.

### Ngày 3 — Báo cáo, lịch sử, Docker và polish

Mục tiêu:

- Hoàn thiện báo cáo, lịch sử, Docker và nghiệm thu.

Công việc:

- Build trang `/orders`.
- Build chi tiết đơn hàng.
- Build trang `/reports`.
- Build dashboard `/`.
- Test responsive mobile.
- Polish UI pastel.
- Viết Dockerfile.
- Viết docker-compose.yml.
- Viết README.
- Chạy `npm audit`.
- Test Docker persist data.
- Review lỗi bảo mật cơ bản.

Kết quả cuối ngày:

- App chạy bằng `docker-compose up --build`.
- Restart container dữ liệu vẫn còn.
- Đủ checklist nghiệm thu.

---

## 24. Acceptance checklist

### 24.1 Checklist chức năng

| STT | Tiêu chí | Mức độ |
|---:|---|---|
| 1 | Thêm sản phẩm | Cơ bản |
| 2 | Sửa sản phẩm | Cơ bản |
| 3 | Xóa sản phẩm | Cơ bản |
| 4 | Xem danh sách sản phẩm kèm tồn kho | Cơ bản |
| 5 | Tạo đơn hàng | Cơ bản |
| 6 | Chọn được nhiều sản phẩm trong một đơn | Cơ bản |
| 7 | Nhập số lượng cho từng sản phẩm | Cơ bản |
| 8 | Tính tiền đúng theo `giá × số lượng` | Quan trọng |
| 9 | Áp dụng giảm giá theo phần trăm | Quan trọng |
| 10 | Áp dụng giảm giá theo số tiền | Quan trọng |
| 11 | Final amount sau giảm giá tính đúng | Quan trọng |
| 12 | Chốt đơn thành công thì tồn kho giảm đúng | Nghiệp vụ bắt buộc |
| 13 | Bán quá tồn kho thì bị chặn | Nghiệp vụ bắt buộc |
| 14 | Khi bán quá tồn kho, không tạo đơn hàng | Nghiệp vụ bắt buộc |
| 15 | Lịch sử đơn hàng hiển thị đúng | Cơ bản |
| 16 | Báo cáo doanh thu ngày hiển thị đúng | Quan trọng |
| 17 | Refresh trang dữ liệu vẫn còn | Kỹ thuật |
| 18 | Restart container dữ liệu vẫn còn | Kỹ thuật |
| 19 | Chạy được theo README | Kỹ thuật |
| 20 | Chạy được bằng `docker-compose up --build` | Kỹ thuật |

### 24.2 Checklist bảo mật

| STT | Tiêu chí |
|---:|---|
| 1 | Không hardcode secrets/API keys |
| 2 | `.env` nằm trong `.gitignore` |
| 3 | Có `.env.example` |
| 4 | Validate input ở backend |
| 5 | Không dùng raw SQL nối chuỗi từ input |
| 6 | Không log dữ liệu nhạy cảm |
| 7 | Không expose stack trace production |
| 8 | Chạy `npm audit` |
| 9 | Test malicious inputs cơ bản |
| 10 | Có setting hạn chế lệnh nguy hiểm khi dùng AI coding |

---

## 25. Test cases nghiệm thu

### Test case 1 — Thêm sản phẩm

Given:

- Người dùng đang ở trang `/products`.

When:

- Người dùng thêm sản phẩm:

```text
Tên: Mì gói
Giá: 5000
Tồn kho: 10
```

Then:

- Sản phẩm xuất hiện trong danh sách.
- Giá hiển thị là `5.000 ₫`.
- Tồn kho hiển thị là `10`.

### Test case 2 — Sửa sản phẩm

Given:

- Sản phẩm `Mì gói` có giá `5000`, tồn kho `10`.

When:

- Người dùng sửa giá thành `6000`, tồn kho thành `12`.

Then:

- Danh sách hiển thị giá `6.000 ₫`.
- Tồn kho hiển thị `12`.

### Test case 3 — Xóa sản phẩm

Given:

- Có sản phẩm trong danh sách.

When:

- Người dùng bấm xóa và xác nhận.

Then:

- Sản phẩm không còn xuất hiện trong danh sách sản phẩm đang bán.

### Test case 4 — Tạo đơn với nhiều sản phẩm

Given:

- Có sản phẩm `Mì gói`, giá `5000`, tồn kho `10`.
- Có sản phẩm `Sữa tươi`, giá `12000`, tồn kho `5`.

When:

- Người dùng thêm `2 Mì gói` và `1 Sữa tươi` vào giỏ.

Then:

- Giỏ hàng có 2 dòng sản phẩm.
- Tổng tiền là `22.000 ₫`.

### Test case 5 — Giảm giá phần trăm

Given:

- Giỏ hàng có tổng tiền `100.000 ₫`.

When:

- Người dùng áp dụng giảm giá `10%`.

Then:

- Số tiền giảm là `10.000 ₫`.
- Thành tiền cuối là `90.000 ₫`.

### Test case 6 — Giảm giá số tiền

Given:

- Giỏ hàng có tổng tiền `100.000 ₫`.

When:

- Người dùng áp dụng giảm giá `20.000 ₫`.

Then:

- Thành tiền cuối là `80.000 ₫`.

### Test case 7 — Chốt đơn thành công và trừ kho

Given:

- Sản phẩm `Mì gói` có tồn kho `10`.

When:

- Người dùng bán `3 Mì gói` và chốt đơn.

Then:

- Order được tạo.
- OrderItem được tạo.
- Tồn kho `Mì gói` còn `7`.
- Toast hiển thị `Chốt đơn thành công`.

### Test case 8 — Chặn bán quá tồn kho

Given:

- Sản phẩm `Sữa tươi` có tồn kho `2`.

When:

- Người dùng nhập số lượng `5` và bấm chốt đơn.

Then:

- Hệ thống báo lỗi không đủ tồn kho.
- Không tạo Order.
- Không tạo OrderItem.
- Tồn kho vẫn là `2`.

### Test case 9 — Lịch sử đơn hàng

Given:

- Có một đơn hàng đã chốt thành công.

When:

- Người dùng mở `/orders`.

Then:

- Đơn hàng xuất hiện trong lịch sử.
- Chi tiết đơn hàng hiển thị đúng sản phẩm, số lượng, đơn giá và thành tiền.

### Test case 10 — Báo cáo doanh thu ngày

Given:

- Hôm nay có 3 đơn hàng có final amount lần lượt:

```text
50.000 ₫
100.000 ₫
150.000 ₫
```

When:

- Người dùng mở `/reports`.

Then:

- Doanh thu hôm nay là `300.000 ₫`.

### Test case 11 — Dữ liệu còn sau khi refresh

Given:

- Người dùng đã thêm sản phẩm và chốt đơn.

When:

- Người dùng refresh trình duyệt.

Then:

- Sản phẩm, tồn kho và lịch sử đơn hàng vẫn còn.

### Test case 12 — Dữ liệu còn sau khi restart Docker

Given:

- App chạy bằng Docker Compose.
- Đã có dữ liệu sản phẩm và đơn hàng.

When:

- Người dùng stop và start lại container.

Then:

- Dữ liệu vẫn còn trong SQLite database.

---

## 26. Definition of Done

Sản phẩm được xem là hoàn thành khi đạt tất cả điều kiện sau:

### 26.1 Product done

- Quản lý sản phẩm hoạt động đầy đủ.
- POS tạo được đơn hàng nhiều sản phẩm.
- Tính tiền đúng.
- Giảm giá đúng.
- Chốt đơn thành công thì tồn kho giảm đúng.
- Bán quá tồn kho bị chặn.
- Lịch sử đơn hàng hiển thị đúng.
- Báo cáo doanh thu theo ngày hiển thị đúng.

### 26.2 Technical done

- Dùng Next.js 14+ App Router.
- Dùng TypeScript.
- Dùng Tailwind CSS và Shadcn UI.
- Dùng SQLite và Prisma.
- Dữ liệu không mất khi refresh trang.
- Dữ liệu không mất khi restart container.
- Có Dockerfile.
- Có docker-compose.yml.
- Có README hướng dẫn chạy.
- App chạy bằng `docker-compose up --build`.

### 26.3 Security done

- Không hardcode secrets.
- `.env` không bị commit.
- Input được validate ở backend.
- Chốt đơn dùng transaction.
- Không bán âm kho.
- Không expose stack trace production.
- Đã chạy kiểm tra dependency cơ bản.
- Đã review thủ công các phần code do AI sinh ra liên quan đến business logic và bảo mật.

---

## 27. Ưu tiên triển khai

### Must have

- Product CRUD.
- POS bán hàng.
- Chọn nhiều sản phẩm.
- Nhập số lượng.
- Tính tổng tiền.
- Giảm giá theo phần trăm.
- Giảm giá theo số tiền.
- Backend kiểm tra tồn kho.
- Chặn bán quá tồn kho.
- Tự động trừ kho khi chốt đơn.
- Lịch sử đơn hàng.
- Báo cáo doanh thu ngày.
- SQLite persistent storage.
- Docker Compose.
- README.
- Security checklist tối thiểu.

### Should have

- Dashboard tổng quan.
- Search sản phẩm theo tên.
- Chi tiết đơn hàng dạng modal/drawer.
- Card cảnh báo sản phẩm tồn kho thấp.
- Responsive mobile tốt.

### Nice to have

- Soft delete sản phẩm bằng `isActive`.
- Filter lịch sử đơn theo ngày.
- Export CSV đơn hàng.
- Seed data mẫu.
- Dark mode.

---

## 28. Kết luận

Mini POS là một sản phẩm MVP nhỏ nhưng có nghiệp vụ thật. Trọng tâm không nằm ở số lượng tính năng, mà nằm ở việc xử lý đúng luồng bán hàng: chọn nhiều sản phẩm, tính tiền đúng, áp dụng giảm giá đúng, chốt đơn an toàn, trừ tồn kho chính xác và chặn bán quá tồn kho. Sản phẩm cũng cần chạy được thật bằng Docker, lưu trữ bền vững bằng SQLite và có các yêu cầu bảo mật tối thiểu khi dùng AI coding để tránh rủi ro hardcode secrets, bỏ qua validation hoặc sinh ra logic nghiệp vụ không an toàn.
