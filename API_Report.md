# Báo cáo chi tiết API Backend

Dưới đây là bảng tổng hợp chi tiết tất cả các API endpoint của hệ thống backend.

**Ghi chú:**
*   **Authentication:**
    *   `Public`: Mọi người đều có thể gọi.
    *   `USER`: Yêu cầu người dùng đăng nhập (có Access Token hợp lệ).
    *   `Permission: [TÊN_QUYỀN]`: Yêu cầu người dùng phải có quyền hạn cụ thể (ví dụ: `Permission: CREATE_MOVIES`).
*   **Request Body / Params:** Liệt kê các trường dữ liệu cần thiết trong `body`, `params` (tham số trên URL), hoặc `query` (tham số truy vấn). Các trường trong `[]` là không bắt buộc.
*   **Response Data:** Mô tả cấu trúc dữ liệu trả về. `Object<User>` nghĩa là một đối tượng có cấu trúc như `User`. `PaginatedResponse<Object<Movie>>` nghĩa là một đối tượng phân trang chứa một mảng các đối tượng `Movie`.

| Module | Endpoint | Description | Authentication | Request Body / Params | Response Data (Kiểu dữ liệu trả về) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST /v1/auth/register` | Đăng ký tài khoản người dùng mới. | Public | `body: { email, password, username, [role] }` | `Object<{ user: User, tokens: Tokens }>` |
| **Auth** | `POST /v1/auth/login` | Đăng nhập và nhận về cặp access/refresh token. | Public | `body: { email, password }` | `Object<{ user: User, tokens: Tokens }>` |
| **Auth** | `POST /v1/auth/logout` | Đăng xuất và vô hiệu hóa refresh token. | Public | `body: { refreshToken }` | `204 No Content` |
| **Auth** | `POST /v1/auth/refresh-token` | Làm mới access token bằng refresh token. | Public | `body: { refreshToken }` | `Object<Tokens>` |
| **Auth** | `POST /v1/auth/change-password` | Người dùng đã đăng nhập thay đổi mật khẩu. | USER | `body: { currentPassword, newPassword, confirmPassword }` | `204 No Content` |
| **Auth** | `GET /v1/auth/google` | Chuyển hướng đến trang đăng nhập của Google. | Public | | |
| **Auth** | `GET /v1/auth/google/callback` | Google gọi lại sau khi người dùng xác thực thành công. | Public | | |
| **Auth** | `GET /v1/auth/me` | Lấy thông tin của người dùng đang đăng nhập. | USER | | `Object<User>` |
| **Auth** | `PATCH /v1/auth/me` | Người dùng tự cập nhật thông tin cá nhân. | USER | `body: { fullName }` | `Object<User>` |
| **User (Admin)** | `POST /v1/users` | (Admin) Tạo một người dùng mới. | Permission: CREATE_USERS | `body: { email, password, username, roleId }` | `Object<User>` |
| **User (Admin)** | `GET /v1/users` | (Admin) Lấy danh sách người dùng với bộ lọc và phân trang. | Permission: READ_USERS | `query: { [name], [role], [sortBy], [limit], [page] }` | `PaginatedResponse<Object<User>>` |
| **User (Admin)** | `GET /v1/users/:userId` | (Admin) Lấy thông tin chi tiết một người dùng. | Permission: READ_USERS | `params: { userId }` | `Object<User>` |
| **User (Admin)** | `PATCH /v1/users/:userId` | (Admin) Cập nhật thông tin một người dùng. | Permission: UPDATE_USERS | `params: { userId }, body: { [email], [password], [username], [roleId], [isActive] }` | `Object<User>` |
| **User (Admin)** | `DELETE /v1/users/:userId` | (Admin) Xóa một người dùng. | Permission: DELETE_USERS | `params: { userId }` | `204 No Content` |
| **Role (Admin)** | `POST /v1/roles` | (Admin) Tạo một vai trò mới. | Permission: CREATE_ROLES | `body: { name, [description], [permissions] }` | `Object<Role>` |
| **Role (Admin)** | `GET /v1/roles` | (Admin) Lấy danh sách tất cả vai trò. | Permission: READ_ROLES | | `Array<Object<Role>>` |
| **Role (Admin)** | `GET /v1/roles/:roleId` | (Admin) Lấy thông tin chi tiết một vai trò. | Permission: READ_ROLES | `params: { roleId }` | `Object<Role>` |
| **Role (Admin)** | `PATCH /v1/roles/:roleId` | (Admin) Cập nhật một vai trò. | Permission: UPDATE_ROLES | `params: { roleId }, body: { [name], [description], [permissions] }` | `Object<Role>` |
| **Role (Admin)** | `DELETE /v1/roles/:roleId` | (Admin) Xóa một vai trò. | Permission: DELETE_ROLES | `params: { roleId }` | `204 No Content` |
| **Permission (Admin)** | `GET /v1/permissions` | (Admin) Lấy danh sách tất cả quyền hạn có trong hệ thống. | Permission: READ_PERMISSIONS | | `Array<Object<Permission>>` |
| **Dashboard (Admin)** | `GET /v1/dashboard` | (Admin) Lấy các số liệu thống kê tổng quan cho dashboard. | Permission: VIEW_DASHBOARD | | `Object<DashboardStats>` |
| **Movie** | `POST /v1/movies` | (Admin) Tạo một bộ phim mới. | Permission: CREATE_MOVIES | `body: { title, description, releaseDate, duration, status, [genres], [directors], [cast], [posterUrl], [trailerUrl], ... }` | `Object<Movie>` |
| **Movie** | `GET /v1/movies` | Lấy danh sách phim có phân trang và bộ lọc. | Permission: READ_MOVIES | `query: { [title], [status], [sortBy], [limit], [page] }` | `PaginatedResponse<Object<Movie>>` |
| **Movie** | `GET /v1/movies/slug/:slug` | Lấy chi tiết một bộ phim bằng slug. | Public | `params: { slug }` | `Object<Movie>` |
| **Movie** | `GET /v1/movies/:movieId` | Lấy chi tiết một bộ phim bằng ID. | Permission: READ_MOVIES | `params: { movieId }` | `Object<Movie>` |
| **Movie** | `PATCH /v1/movies/:movieId` | (Admin) Cập nhật thông tin một bộ phim. | Permission: UPDATE_MOVIES | `params: { movieId }, body: { [title], [description], ... }` | `Object<Movie>` |
| **Movie** | `DELETE /v1/movies/:movieId` | (Admin) Xóa một bộ phim. | Permission: DELETE_MOVIES | `params: { movieId }` | `204 No Content` |
| **Genre** | `POST /v1/genres` | (Admin) Tạo một thể loại mới. | Permission: CREATE_GENRES | `body: { name, [description] }` | `Object<Genre>` |
| **Genre** | `GET /v1/genres` | Lấy danh sách tất cả thể loại. | Permission: READ_GENRES | | `Array<Object<Genre>>` |
| **Genre** | `GET /v1/genres/:genreId` | Lấy chi tiết một thể loại. | Permission: READ_GENRES | `params: { genreId }` | `Object<Genre>` |
| **Genre** | `PATCH /v1/genres/:genreId` | (Admin) Cập nhật một thể loại. | Permission: UPDATE_GENRES | `params: { genreId }, body: { [name], [description] }` | `Object<Genre>` |
| **Genre** | `DELETE /v1/genres/:genreId` | (Admin) Xóa một thể loại. | Permission: DELETE_GENRES | `params: { genreId }` | `204 No Content` |
| **Person** | `POST /v1/people` | (Admin) Tạo thông tin diễn viên/đạo diễn mới. | Permission: CREATE_PEOPLE | `body: { name, [dob], [bio], [photoUrl] }` | `Object<Person>` |
| **Person** | `GET /v1/people` | Lấy danh sách tất cả diễn viên/đạo diễn. | Permission: READ_PEOPLE | | `Array<Object<Person>>` |
| **Person** | `GET /v1/people/:personId` | Lấy chi tiết một diễn viên/đạo diễn. | Permission: READ_PEOPLE | `params: { personId }` | `Object<Person>` |
| **Person** | `PATCH /v1/people/:personId` | (Admin) Cập nhật thông tin diễn viên/đạo diễn. | Permission: UPDATE_PEOPLE | `params: { personId }, body: { [name], [dob], ... }` | `Object<Person>` |
| **Person** | `DELETE /v1/people/:personId` | (Admin) Xóa thông tin diễn viên/đạo diễn. | Permission: DELETE_PEOPLE | `params: { personId }` | `204 No Content` |
| **Review** | `GET /v1/reviews/movie/:movieId` | Lấy tất cả đánh giá của một bộ phim. | Public | `params: { movieId }` | `Array<Object<Review>>` |
| **Review** | `POST /v1/reviews` | Tạo một đánh giá mới cho một bộ phim. | Permission: CREATE_OWN_REVIEW | `body: { movie, rating, [comment] }` | `Object<Review>` |
| **Review** | `PATCH /v1/reviews/:reviewId` | Cập nhật đánh giá của chính mình. | Permission: EDIT_OWN_REVIEW | `params: { reviewId }, body: { [rating], [comment] }` | `Object<Review>` |
| **Review** | `DELETE /v1/reviews/:reviewId` | Xóa một đánh giá. | Permission: DELETE_OWN_REVIEW hoặc DELETE_ANY_REVIEW | `params: { reviewId }` | `204 No Content` |
| **Review** | `GET /v1/reviews/me` | Lấy tất cả đánh giá của người dùng đang đăng nhập. | Permission: READ_OWN_REVIEWS | | `Array<Object<Review>>` |
| **History** | `GET /v1/history` | Lấy toàn bộ lịch sử xem phim của người dùng. | Permission: READ_OWN_HISTORY | | `Array<Object<History>>` |
| **History** | `GET /v1/history/movie/:movieId` | Lấy lịch sử xem của một phim cụ thể. | Permission: READ_OWN_HISTORY | `params: { movieId }` | `Object<History>` |
| **History** | `PUT /v1/history` | Cập nhật (hoặc tạo mới) tiến độ xem phim. | Permission: UPDATE_OWN_HISTORY | `body: { movie, progress }` | `Object<History>` |
| **History** | `DELETE /v1/history/:historyId` | Xóa một mục khỏi lịch sử xem phim. | Permission: DELETE_OWN_HISTORY | `params: { historyId }` | `204 No Content` | 