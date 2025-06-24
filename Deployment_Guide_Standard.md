# Hướng dẫn Triển khai Chuẩn (Dựa trên Cấu hình Dự án)

Tài liệu này được biên soạn lại dựa trên các tệp cấu hình (`docker-compose.yml`, `.env`, `Dockerfile`) trong dự án của bạn để cung cấp một quy trình triển khai chính xác và chuẩn hóa. Hướng dẫn bao gồm cả việc chạy toàn bộ hệ thống bằng Docker Compose và chạy cho mục đích phát triển cục bộ.

## Phần 1: Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau trên máy của mình:
*   **Git:** Để tải mã nguồn từ repository.
*   **Node.js:** (Khuyến nghị phiên bản 20.x hoặc cao hơn).
*   **npm** (hoặc trình quản lý gói tương đương).
*   **Docker:** Để chạy cơ sở dữ liệu và toàn bộ hệ thống.

## Phần 2: Thiết lập Ban đầu (Chỉ thực hiện một lần)

### Chạy Container MongoDB
Theo thiết kế của bạn, cơ sở dữ liệu sẽ chạy như một container Docker độc lập.

Chạy lệnh sau để khởi chạy container MongoDB:
```bash
docker run -d --name my-mongo-db -p 27017:27017 -v mongo-data:/data/db mongo:latest
```
*   **Giải thích:** Lệnh này khởi chạy một container MongoDB tên là `my-mongo-db` và ánh xạ cổng `27017` của nó ra máy của bạn. Dữ liệu sẽ được lưu trữ bền vững trong một volume tên là `mongo-data`. Container này sẽ chạy nền và độc lập với các dịch vụ ứng dụng.

## Phần 3: Triển khai với Docker Compose (Môi trường Production/Staging)

Đây là phương pháp được khuyến nghị để chạy toàn bộ hệ thống (backend và frontend) một cách đồng bộ, dựa trên tệp `docker-compose.yml` của bạn.

### Bước 1: Lấy mã nguồn
```bash
# Thay thế bằng URL repository của bạn
git clone <URL_REPOSITORY>
cd <TEN_THU_MUC_DU_AN>
```

### Bước 2: Tạo tệp môi trường `.env` ở thư mục gốc
Tạo một tệp tên là `.env` tại thư mục gốc của dự án (ngang hàng với `docker-compose.yml`) và sử dụng nội dung bạn đã cung cấp:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost

# Kết nối đến MongoDB đang chạy trên máy host từ bên trong container
MONGODB_URI=mongodb://host.docker.internal:27017/movie

# JWT Configuration
JWT_SECRET=539fc40fadfcddc3f7de19e2f418bd5c9ffccee423e3cdceaa2e6298c53390e46a9c490dd154a64bf923dcf3a15e75f1d79959c253c4665fbfb34e1c828fffbd
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# URL cho Frontend Build
VITE_API_URL=http://localhost:5000/api/v1
```
*   **Điểm mấu chốt:** `MONGODB_URI=mongodb://host.docker.internal:27017/movie`. Tệp `docker-compose.yml` của bạn sử dụng `extra_hosts` để định nghĩa `host.docker.internal`. Đây là một DNS name đặc biệt mà Docker cung cấp để container `backend` có thể kết nối đến dịch vụ (container `my-mongo-db`) đang chạy trên máy chủ (host).

### Bước 3: Khởi chạy hệ thống
Chạy lệnh sau từ thư mục gốc của dự án:
```bash
docker-compose up --build -d
```
*   `--build`: Build lại image nếu có thay đổi trong mã nguồn.
*   `-d`: Chạy ở chế độ nền.

### Bước 4: Truy cập ứng dụng
*   **Frontend:** [http://localhost](http://localhost) (do `docker-compose.yml` ánh xạ cổng `80:80`).
*   **Backend API:** [http://localhost:5000](http://localhost:5000).

### Bước 5: Dừng hệ thống
```bash
docker-compose down
```

## Phần 4: Chạy trên máy cục bộ (Local Development)

Phương pháp này phù hợp khi bạn đang lập trình và cần tính năng hot-reload. Cần mở 2 cửa sổ terminal riêng biệt. Cơ sở dữ liệu MongoDB vẫn đang chạy bằng Docker như ở Phần 2.

### Terminal 1: Chạy Backend (`movie-be`)
1.  Di chuyển vào thư mục: `cd movie-be`
2.  Đảm bảo tệp `movie-be/.env` tồn tại và có nội dung đúng. Đặc biệt:
    ```env
    MONGODB_URI=mongodb://localhost:27017/movie
    ```
3.  Cài đặt dependencies: `npm install`
4.  Khởi chạy server: `npm run dev`
5.  Backend sẽ chạy tại `http://localhost:5000`.

### Terminal 2: Chạy Frontend (`movie-fe`)
1.  Di chuyển vào thư mục: `cd movie-fe`
2.  Đảm bảo tệp `movie-fe/.env` tồn tại và có nội dung đúng:
    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    ```
3.  Cài đặt dependencies: `npm install`
4.  Khởi chạy server: `npm run dev`
5.  Frontend sẽ chạy tại `http://localhost:3000` (theo cấu hình mặc định của Vite). 