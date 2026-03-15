# TÀI LIỆU ĐẶC TẢ HỆ THỐNG: NỀN TẢNG QUẢN LÝ GHGVIETNAM HUB

## I. BẢN ĐẶC TẢ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

### 1. Bảng `Users` (Quản lý nhân sự & Thành viên mạng lưới)
Lưu trữ thông tin nhân sự nội bộ và đại diện của các đối tác (Chuyên gia, Doanh nghiệp, Startup).

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID/INT | PK, Auto Increment | Mã định danh người dùng |
| `full_name` | VARCHAR(255) | NOT NULL | Họ và tên |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập / liên hệ |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa |
| `position` | VARCHAR(100) | NULL | Chức vụ (VD: Chuyên gia, Giám đốc, Mentor) |
| `department` | VARCHAR(100) | NULL | Phòng ban / Lĩnh vực chuyên môn |
| `role` | ENUM | NOT NULL | Phân quyền: `ADMIN`, `STAFF`, `EXPERT`, `ENTERPRISE`, `STARTUP` |
| `partner_id` | UUID/INT | FK, NULL | Liên kết đến bảng `Partners` (nếu là đối tác ngoài) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

### 2. Bảng `Tasks` (Quản lý công việc)
Quản lý các công việc nội bộ hoặc các task trong các dự án tư vấn (Kiểm kê khí nhà kính, Báo cáo ESG,...).

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID/INT | PK, Auto Increment | Mã định danh công việc |
| `task_name` | VARCHAR(255) | NOT NULL | Tên công việc |
| `description` | TEXT | NULL | Mô tả chi tiết công việc |
| `assignee_id` | UUID/INT | FK (Users.id) | Người được giao việc |
| `roadmap_id` | UUID/INT | FK (Roadmaps.id), NULL | Thuộc lộ trình/dự án nào (nếu có) |
| `status` | ENUM | DEFAULT 'PENDING' | Trạng thái: `PENDING`, `IN_PROGRESS`, `REVIEWING`, `COMPLETED`, `OVERDUE` |
| `deadline` | DATETIME | NOT NULL | Hạn chót hoàn thành |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

### 3. Bảng `Roadmaps` (Lộ trình kế hoạch / Dự án)
Quản lý các lộ trình dài hạn (VD: Lộ trình ESG cho doanh nghiệp A, Dự án tín chỉ Carbon, Kế hoạch Net Zero).

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID/INT | PK, Auto Increment | Mã định danh lộ trình/dự án |
| `project_name` | VARCHAR(255) | NOT NULL | Tên dự án / Lộ trình |
| `description` | TEXT | NULL | Mục tiêu và mô tả lộ trình |
| `manager_id` | UUID/INT | FK (Users.id) | Người quản lý/phụ trách lộ trình |
| `partner_id` | UUID/INT | FK (Partners.id), NULL | Khách hàng/Đối tác của dự án này |
| `start_date` | DATE | NOT NULL | Ngày bắt đầu |
| `end_date` | DATE | NOT NULL | Ngày kết thúc dự kiến |
| `progress` | TINYINT | DEFAULT 0 | Tiến độ hoàn thành (0 - 100%) |
| `status` | ENUM | DEFAULT 'PLANNING' | Trạng thái: `PLANNING`, `ONGOING`, `ON_HOLD`, `COMPLETED` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |

### 4. Bảng `Partners` (Mở rộng: Quản lý mạng lưới đối tác)
Phục vụ cho hệ sinh thái GHGVIETNAM HUB (hơn 1000 thành viên).

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID/INT | PK, Auto Increment | Mã định danh đối tác |
| `partner_name` | VARCHAR(255) | NOT NULL | Tên tổ chức/doanh nghiệp/startup |
| `partner_type` | ENUM | NOT NULL | Loại: `ENTERPRISE`, `STARTUP`, `INVESTOR`, `NGO` |
| `industry` | VARCHAR(100) | NULL | Lĩnh vực hoạt động |
| `join_date` | DATE | NOT NULL | Ngày gia nhập mạng lưới |

### 5. Bảng `Events` (Mở rộng: Quản lý hoạt động HUB)
Quản lý các sự kiện như GHG Talk, Workshop đào tạo, Business Matching.

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | UUID/INT | PK, Auto Increment | Mã định danh sự kiện |
| `title` | VARCHAR(255) | NOT NULL | Tên sự kiện |
| `event_type` | ENUM | NOT NULL | Loại: `TALKSHOW`, `WORKSHOP`, `MATCHING`, `TRAINING` |
| `event_date` | DATETIME | NOT NULL | Thời gian diễn ra |
| `location` | VARCHAR(255) | NULL | Địa điểm (Offline tại HUB hoặc Online) |

---

## II. DANH SÁCH API (RESTful API SPECIFICATIONS)

*Base URL giả định: `/api/v1`*
*Authentication: Yêu cầu Bearer Token (JWT) cho tất cả các endpoint (trừ Login).*

### 1. Users API (Nhân sự & Phân quyền)
| Method | Endpoint | Tham số đầu vào (Body/Query) | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | `email`, `password` | Đăng nhập, trả về JWT Token |
| `GET` | `/users` | `?role=...&department=...` | Lấy danh sách nhân sự (có filter) |
| `POST` | `/users` | `full_name`, `email`, `position`, `department`, `role` | Thêm mới nhân sự/thành viên |
| `GET` | `/users/{id}` | - | Xem chi tiết thông tin một nhân sự |
| `PUT` | `/users/{id}` | `position`, `department`, `role` | Cập nhật thông tin nhân sự |
| `DELETE` | `/users/{id}` | - | Xóa/Deactivate nhân sự |

### 2. Tasks API (Quản lý công việc)
| Method | Endpoint | Tham số đầu vào (Body/Query) | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | `?assignee_id=...&status=...` | Lấy danh sách công việc |
| `POST` | `/tasks` | `task_name`, `assignee_id`, `roadmap_id`, `deadline` | Tạo công việc mới và giao việc |
| `GET` | `/tasks/{id}` | - | Xem chi tiết công việc |
| `PUT` | `/tasks/{id}` | `task_name`, `deadline`, `description` | Cập nhật thông tin công việc |
| `PATCH`| `/tasks/{id}/status` | `status` | Cập nhật nhanh trạng thái công việc (Kéo thả Kanban) |
| `GET` | `/users/{id}/tasks` | `?status=...` | Lấy danh sách công việc của 1 nhân sự cụ thể |

### 3. Roadmaps API (Lộ trình kế hoạch)
| Method | Endpoint | Tham số đầu vào (Body/Query) | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `GET` | `/roadmaps` | `?status=...&partner_id=...` | Lấy danh sách lộ trình/dự án |
| `POST` | `/roadmaps` | `project_name`, `start_date`, `end_date`, `manager_id` | Tạo lộ trình kế hoạch mới |
| `GET` | `/roadmaps/{id}` | - | Xem chi tiết lộ trình (bao gồm các tasks con) |
| `PUT` | `/roadmaps/{id}` | `project_name`, `start_date`, `end_date` | Cập nhật thông tin lộ trình |
| `PATCH`| `/roadmaps/{id}/progress`| `progress` (0-100) | Cập nhật % tiến độ của lộ trình |
| `GET` | `/roadmaps/{id}/tasks` | - | Lấy toàn bộ công việc thuộc lộ trình này |

### 4. Mở rộng: Partners & Events API (Dành cho Hệ sinh thái HUB)
| Method | Endpoint | Mô tả chức năng |
| :--- | :--- | :--- |
| `GET` | `/partners` | Lấy danh sách doanh nghiệp/startup trong mạng lưới |
| `POST` | `/partners` | Thêm đối tác mới vào GHGVIETNAM HUB |
| `GET` | `/events` | Lấy danh sách các buổi Workshop, GHG Talk |
| `POST` | `/events` | Tạo lịch sự kiện mới |

---

### 📌 Ghi chú dành cho Backend Team:
1. **Bảo mật (Security):** Cần implement Role-Based Access Control (RBAC). Ví dụ: Chỉ `ADMIN` hoặc `MANAGER` mới được quyền tạo `Roadmaps`, `STAFF` chỉ được phép cập nhật `status` của `Tasks` được giao.
2. **Tính toán tiến độ (Auto-calculation):** Cân nhắc viết trigger hoặc logic ở Service layer để tự động cập nhật `progress` của `Roadmaps` dựa trên tỷ lệ phần trăm các `Tasks` con đã chuyển sang trạng thái `COMPLETED`.
3. **Thông báo (Notifications):** Nên thiết kế thêm một module Cronjob hoặc Event-driven để gửi email/thông báo hệ thống khi `Tasks` sắp đến `deadline` (Overdue).
