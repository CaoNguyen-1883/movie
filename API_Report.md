# Báo cáo chi tiết API Backend

Dưới đây là bảng tổng hợp chi tiết tất cả các API endpoint của hệ thống backend.

**Ghi chú:**
*   **Authentication:**
    *   `Public`: Mọi người đều có thể gọi.
    *   `USER`: Yêu cầu người dùng đăng nhập (có Access Token hợp lệ).
    *   `Permission: [TÊN_QUYỀN]`: Yêu cầu người dùng phải có quyền hạn cụ thể (ví dụ: `Permission: CREATE_MOVIES`).
*   **Request Body / Params:** Liệt kê các trường dữ liệu cần thiết trong `body`, `params` (tham số trên URL), hoặc `query` (tham số truy vấn). Các trường trong `[]` là không bắt buộc.
*   **Response Data:** Mô tả cấu trúc dữ liệu trả về với các trường chi tiết.

| Module | Endpoint | Description | Authentication | Request Body / Params | Response Data (Kiểu dữ liệu trả về) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST /v1/auth/register` | Đăng ký tài khoản người dùng mới. | Public | `body: { email, password, username, [role] }` | <pre lang="json"><code>{<br>  "user": { "id", "username", "email", ... },<br>  "tokens": {<br>    "access": { "token", "expires" },<br>    "refresh": { "token", "expires" }<br>  }<br>}</code></pre> |
| **Auth** | `POST /v1/auth/login` | Đăng nhập và nhận về cặp access/refresh token. | Public | `body: { email, password }` | <pre lang="json"><code>{<br>  "user": { "id", "username", "email", ... },<br>  "tokens": {<br>    "access": { "token", "expires" },<br>    "refresh": { "token", "expires" }<br>  }<br>}</code></pre> |
| **Auth** | `POST /v1/auth/logout` | Đăng xuất và vô hiệu hóa refresh token. | Public | `body: { refreshToken }` | `204 No Content` |
| **Auth** | `POST /v1/auth/refresh-token` | Làm mới access token bằng refresh token. | Public | `body: { refreshToken }` | <pre lang="json"><code>{<br>  "access": { "token", "expires" },<br>  "refresh": { "token", "expires" }<br>}</code></pre> |
| **Auth** | `POST /v1/auth/change-password` | Người dùng đã đăng nhập thay đổi mật khẩu. | USER | `body: { currentPassword, newPassword, confirmPassword }` | `204 No Content` |
| **Auth** | `GET /v1/auth/google` | Chuyển hướng đến trang đăng nhập của Google. | Public | | |
| **Auth** | `GET /v1/auth/google/callback` | Google gọi lại sau khi người dùng xác thực thành công. | Public | | |
| **Auth** | `GET /v1/auth/me` | Lấy thông tin của người dùng đang đăng nhập. | USER | | <pre lang="json"><code>{ "id", "username", "email", "fullName", "avatarUrl", "roles": [...] }</code></pre> |
| **Auth** | `PATCH /v1/auth/me` | Người dùng tự cập nhật thông tin cá nhân. | USER | `body: { fullName }` | <pre lang="json"><code>{ "id", "username", "email", "fullName", ... }</code></pre> |
| **User (Admin)** | `POST /v1/users` | (Admin) Tạo một người dùng mới. | Permission: CREATE_USERS | `body: { email, password, username, roleId }` | <pre lang="json"><code>{ "id", "username", "email", "roles": [...] }</code></pre> |
| **User (Admin)** | `GET /v1/users` | (Admin) Lấy danh sách người dùng với bộ lọc và phân trang. | Permission: READ_USERS | `query: { [name], [role], [sortBy], [limit], [page] }` | <pre lang="json"><code>{<br>  "results": [ { "id", "username", ... } ],<br>  "page", "limit", "totalPages", "totalResults"<br>}</code></pre> |
| **User (Admin)** | `GET /v1/users/:userId` | (Admin) Lấy thông tin chi tiết một người dùng. | Permission: READ_USERS | `params: { userId }` | <pre lang="json"><code>{ "id", "username", "email", "roles": [...] }</code></pre> |
| **User (Admin)** | `PATCH /v1/users/:userId` | (Admin) Cập nhật thông tin một người dùng. | Permission: UPDATE_USERS | `params: { userId }, body: { [email], [password], [username], [roleId], [isActive] }` | <pre lang="json"><code>{ "id", "username", "email", "roles": [...] }</code></pre> |
| **User (Admin)** | `DELETE /v1/users/:userId` | (Admin) Xóa một người dùng. | Permission: DELETE_USERS | `params: { userId }` | `204 No Content` |
| **Role (Admin)** | `POST /v1/roles` | (Admin) Tạo một vai trò mới. | Permission: CREATE_ROLES | `body: { name, [description], [permissions] }` | <pre lang="json"><code>{ "id", "name", "description", "permissions": [...] }</code></pre> |
| **Role (Admin)** | `GET /v1/roles` | (Admin) Lấy danh sách tất cả vai trò. | Permission: READ_ROLES | | <pre lang="json"><code>[<br>  { "id", "name", "description", "permissions": [...] }<br>]</code></pre> |
| **Role (Admin)** | `GET /v1/roles/:roleId` | (Admin) Lấy thông tin chi tiết một vai trò. | Permission: READ_ROLES | `params: { roleId }` | <pre lang="json"><code>{ "id", "name", "description", "permissions": [...] }</code></pre> |
| **Role (Admin)** | `PATCH /v1/roles/:roleId` | (Admin) Cập nhật một vai trò. | Permission: UPDATE_ROLES | `params: { roleId }, body: { [name], [description], [permissions] }` | <pre lang="json"><code>{ "id", "name", "description", "permissions": [...] }</code></pre> |
| **Role (Admin)** | `DELETE /v1/roles/:roleId` | (Admin) Xóa một vai trò. | Permission: DELETE_ROLES | `params: { roleId }` | `204 No Content` |
| **Permission (Admin)** | `GET /v1/permissions` | (Admin) Lấy danh sách tất cả quyền hạn có trong hệ thống. | Permission: READ_PERMISSIONS | | <pre lang="json"><code>[ { "id", "name", "description" } ]</code></pre> |
| **Dashboard (Admin)** | `GET /v1/dashboard` | (Admin) Lấy các số liệu thống kê tổng quan cho dashboard. | Permission: VIEW_DASHBOARD | | <pre lang="json"><code>{ "users", "movies", "views", "sales", ... }</code></pre> |
| **Movie** | `POST /v1/movies` | (Admin) Tạo một bộ phim mới. | Permission: CREATE_MOVIES | `body: { title, description, releaseDate, duration, status, [genres], [directors], [cast], [posterUrl], [trailerUrl], ... }` | <pre lang="json"><code>{ "_id", "title", "slug", "description", ... }</code></pre> |
| **Movie** | `GET /v1/movies` | Lấy danh sách phim có phân trang và bộ lọc. | Permission: READ_MOVIES | `query: { [title], [status], [sortBy], [limit], [page] }` | <pre lang="json"><code>{<br>  "results": [ { "_id", "title", "slug", ... } ],<br>  "page", "limit", "totalPages", "totalResults"<br>}</code></pre> |
| **Movie** | `GET /v1/movies/slug/:slug` | Lấy chi tiết một bộ phim bằng slug. | Public | `params: { slug }` | <pre lang="json"><code>{ "_id", "title", "slug", "description", "genres": [...], "cast": [...] }</code></pre> |
| **Movie** | `GET /v1/movies/:movieId` | Lấy chi tiết một bộ phim bằng ID. | Permission: READ_MOVIES | `params: { movieId }` | <pre lang="json"><code>{ "_id", "title", "slug", "description", ... }</code></pre> |
| **Movie** | `PATCH /v1/movies/:movieId` | (Admin) Cập nhật thông tin một bộ phim. | Permission: UPDATE_MOVIES | `params: { movieId }, body: { [title], [description], ... }` | <pre lang="json"><code>{ "_id", "title", "slug", "description", ... }</code></pre> |
| **Movie** | `DELETE /v1/movies/:movieId` | (Admin) Xóa một bộ phim. | Permission: DELETE_MOVIES | `params: { movieId }` | `204 No Content` |
| **Genre** | `POST /v1/genres` | (Admin) Tạo một thể loại mới. | Permission: CREATE_GENRES | `body: { name, [description] }` | <pre lang="json"><code>{ "_id", "name", "description" }</code></pre> |
| **Genre** | `GET /v1/genres` | Lấy danh sách tất cả thể loại. | Permission: READ_GENRES | | <pre lang="json"><code>[ { "_id", "name", "description" } ]</code></pre> |
| **Genre** | `GET /v1/genres/:genreId` | Lấy chi tiết một thể loại. | Permission: READ_GENRES | `params: { genreId }` | <pre lang="json"><code>{ "_id", "name", "description" }</code></pre> |
| **Genre** | `PATCH /v1/genres/:genreId` | (Admin) Cập nhật một thể loại. | Permission: UPDATE_GENRES | `params: { genreId }, body: { [name], [description] }` | <pre lang="json"><code>{ "_id", "name", "description" }</code></pre> |
| **Genre** | `DELETE /v1/genres/:genreId` | (Admin) Xóa một thể loại. | Permission: DELETE_GENRES | `params: { genreId }` | `204 No Content` |
| **Person** | `POST /v1/people` | (Admin) Tạo thông tin diễn viên/đạo diễn mới. | Permission: CREATE_PEOPLE | `body: { name, [dob], [bio], [photoUrl] }` | <pre lang="json"><code>{ "_id", "name", "dob", "bio", "photoUrl" }</code></pre> |
| **Person** | `GET /v1/people` | Lấy danh sách tất cả diễn viên/đạo diễn. | Permission: READ_PEOPLE | | <pre lang="json"><code>[ { "_id", "name", "photoUrl" } ]</code></pre> |
| **Person** | `GET /v1/people/:personId` | Lấy chi tiết một diễn viên/đạo diễn. | Permission: READ_PEOPLE | `params: { personId }` | <pre lang="json"><code>{ "_id", "name", "dob", "bio", "photoUrl" }</code></pre> |
| **Person** | `PATCH /v1/people/:personId` | (Admin) Cập nhật thông tin diễn viên/đạo diễn. | Permission: UPDATE_PEOPLE | `params: { personId }, body: { [name], [dob], ... }` | <pre lang="json"><code>{ "_id", "name", "dob", "bio", "photoUrl" }</code></pre> |
| **Person** | `DELETE /v1/people/:personId` | (Admin) Xóa thông tin diễn viên/đạo diễn. | Permission: DELETE_PEOPLE | `params: { personId }` | `204 No Content` |
| **Review** | `GET /v1/reviews/movie/:movieId` | Lấy tất cả đánh giá của một bộ phim. | Public | `params: { movieId }` | <pre lang="json"><code>[<br>  { "_id", "rating", "comment", "user": { "id", "username" } }<br>]</code></pre> |
| **Review** | `POST /v1/reviews` | Tạo một đánh giá mới cho một bộ phim. | Permission: CREATE_OWN_REVIEW | `body: { movie, rating, [comment] }` | <pre lang="json"><code>{ "_id", "rating", "comment", "user": ... }</code></pre> |
| **Review** | `PATCH /v1/reviews/:reviewId` | Cập nhật đánh giá của chính mình. | Permission: EDIT_OWN_REVIEW | `params: { reviewId }, body: { [rating], [comment] }` | <pre lang="json"><code>{ "_id", "rating", "comment", "user": ... }</code></pre> |
| **Review** | `DELETE /v1/reviews/:reviewId` | Xóa một đánh giá. | Permission: DELETE_OWN_REVIEW hoặc DELETE_ANY_REVIEW | `params: { reviewId }` | `204 No Content` |
| **Review** | `GET /v1/reviews/me` | Lấy tất cả đánh giá của người dùng đang đăng nhập. | Permission: READ_OWN_REVIEWS | | <pre lang="json"><code>[ { "_id", "rating", "comment", "movie": { ... } } ]</code></pre> |
| **History** | `GET /v1/history` | Lấy toàn bộ lịch sử xem phim của người dùng. | Permission: READ_OWN_HISTORY | | <pre lang="json"><code>[<br>  { "_id", "progress", "isFinished", "movie": { "_id", "title", "slug" } }<br>]</code></pre> |
| **History** | `GET /v1/history/movie/:movieId` | Lấy lịch sử xem của một phim cụ thể. | Permission: READ_OWN_HISTORY | `params: { movieId }` | <pre lang="json"><code>{ "_id", "progress", "isFinished", ... }</code></pre> |
| **History** | `PUT /v1/history` | Cập nhật (hoặc tạo mới) tiến độ xem phim. | Permission: UPDATE_OWN_HISTORY | `body: { movie, progress }` | <pre lang="json"><code>{ "_id", "progress", "isFinished", ... }</code></pre> |
| **History** | `DELETE /v1/history/:historyId` | Xóa một mục khỏi lịch sử xem phim. | Permission: DELETE_OWN_HISTORY | `params: { historyId }` | `204 No Content` | 