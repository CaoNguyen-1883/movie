# Hướng dẫn Triển khai Hệ thống (Từ A-Z)

Tài liệu này cung cấp hướng dẫn chi tiết để thiết lập và chạy toàn bộ dự án từ mã nguồn trên GitHub, bao gồm cả việc chạy các thành phần bằng câu lệnh và bằng Docker một cách độc lập.

## Phần 1: Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau trên máy của mình:
*   **Git:** Để tải mã nguồn từ repository.
*   **Node.js:** (Khuyến nghị phiên bản 20.x hoặc cao hơn).
*   **npm** (hoặc trình quản lý gói khác như pnpm, yarn).
*   **Docker:** Để chạy cơ sở dữ liệu và container hóa ứng dụng.

## Phần 2: Thiết lập Cơ sở dữ liệu (MongoDB)

Chúng ta sẽ chạy MongoDB như một container Docker độc lập.

1.  **Tạo mạng Docker (Bridge Network):**
    Việc tạo một mạng riêng giúp các container (backend và database) có thể "nhìn thấy" và giao tiếp với nhau một cách dễ dàng qua tên container.
    ```bash
    docker network create movie-net
    ```

2.  **Khởi chạy container MongoDB:**
    Chạy lệnh sau để tạo và khởi động container MongoDB, kết nối nó vào mạng `movie-net` vừa tạo.
    ```bash
    docker run -d --name movie-db --network movie-net -p 27017:27017 -v mongo-data:/data/db mongo:latest
    ```
    *   `-d`: Chạy ở chế độ nền.
    *   `--name movie-db`: Đặt tên cho container là `movie-db` để backend có thể kết nối đến.
    *   `--network movie-net`: Kết nối container vào mạng `movie-net`.
    *   `-p 27017:27017`: Ánh xạ cổng 27017 của container ra cổng 27017 trên máy của bạn.
    *   `-v mongo-data:/data/db`: Tạo một volume tên `mongo-data` để lưu trữ dữ liệu CSDL, đảm bảo dữ liệu không bị mất khi container bị xóa hoặc khởi động lại.

## Phần 3: Thiết lập Backend (`movie-be`)

1.  **Lấy mã nguồn và di chuyển vào thư mục:**
    (Thay thế `<URL_REPOSITORY>` bằng URL thực tế)
    ```bash
    git clone <URL_REPOSITORY>
    cd <TEN_THU_MUC_DU_AN>/movie-be
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

3.  **Tạo tệp môi trường `.env`:**
    Tạo một tệp tên là `.env` trong thư mục `movie-be` với nội dung sau:
    ```env
    # Kết nối đến container MongoDB đang chạy trên cùng mạng Docker
    MONGO_URI=mongodb://movie-db:27017/movie_db

    # THAY THẾ bằng một chuỗi bí mật ngẫu nhiên và mạnh mẽ của riêng bạn
    JWT_SECRET=your_super_secret_jwt_key_that_is_long_and_random
    JWT_ACCESS_EXPIRATION_MINUTES=30
    JWT_REFRESH_EXPIRATION_DAYS=30

    PORT=5000
    CORS_ORIGIN=http://localhost:3000
    ```
    **Lưu ý:** `MONGO_URI` sử dụng tên container `movie-db` vì chúng ta sẽ chạy container backend trong cùng mạng `movie-net`.

4.  **Chạy Backend (Chọn một trong hai cách):**

    *   **Cách 1: Chạy trực tiếp trên máy (Development)**
        ```bash
        npm run dev
        ```
        Server backend sẽ chạy tại `http://localhost:5000`. Cách này tiện cho việc code và xem thay đổi ngay lập tức.

    *   **Cách 2: Chạy bằng Docker (Production)**
        a. **Build Docker image:**
           ```bash
           docker build -t movie-backend .
           ```
        b. **Chạy Docker container:**
           ```bash
           docker run -d --name movie-backend-container --network movie-net -p 5000:5000 --env-file .env movie-backend
           ```
           Lệnh này sẽ khởi chạy container backend, kết nối vào mạng `movie-net` và đọc các biến môi trường từ tệp `.env` đã tạo.

## Phần 4: Thiết lập Frontend (`movie-fe`)

1.  **Di chuyển vào thư mục frontend:**
    (Từ thư mục gốc của dự án)
    ```bash
    cd ../movie-fe
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

3.  **Chạy Frontend (Chọn một trong hai cách):**

    *   **Cách 1: Chạy trực tiếp trên máy (Development)**
        a. **Tạo tệp `.env`:** Tạo tệp `.env` trong thư mục `movie-fe` với nội dung:
           ```env
           VITE_API_URL=http://localhost:5000
           ```
        b. **Chạy server dev:**
           ```bash
           npm run dev
           ```
           Ứng dụng frontend sẽ chạy tại `http://localhost:3000`.

    *   **Cách 2: Chạy bằng Docker (Production)**
        a. **Build Docker image:**
           Tệp `Dockerfile` của frontend đã được cấu hình để phục vụ ứng dụng bằng Nginx.
           ```bash
           docker build -t movie-frontend .
           ```
        b. **Chạy Docker container:**
           ```bash
           docker run -d --name movie-frontend-container --network movie-net -p 3000:80 movie-frontend
           ```
           Container Nginx sẽ chạy, phục vụ ứng dụng React tại `http://localhost:3000`. Tệp `nginx.conf` đã được cấu hình sẵn để tự động proxy các request có đường dẫn `/api` đến container backend (`http://backend:5000`).

## Phần 5: Tổng kết

Sau khi hoàn thành các bước trên, bạn sẽ có một hệ thống hoàn chỉnh đang chạy:
-   **Cơ sở dữ liệu:** Chạy trong container Docker `movie-db`.
-   **Backend:** Chạy tại `http://localhost:5000`.
-   **Frontend:** Chạy tại `http://localhost:3000`. 