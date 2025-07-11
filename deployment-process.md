---
trigger: always_on
---

# Quy trình Phát triển Dự án cho Khách hàng

*Mục tiêu: Đảm bảo quy trình làm việc minh bạch, hiệu quả và giao sản phẩm đúng với mong đợi của Khách hàng.*

---

### **Bước 1: Lắng nghe và Phân tích Yêu cầu**
- **Nhiệm vụ của tôi:** Phải hiểu rõ tầm nhìn và mục tiêu của Khách hàng.
- **Hành động:**
    - Tổ chức một buổi trao đổi để lắng nghe yêu cầu, đối tượng người dùng mà Khách hàng hướng tới, và các tính năng quan trọng nhất.
    - Nghiên cứu thị trường và các đối thủ cạnh tranh để đưa ra những tư vấn hữu ích.
    - Soạn thảo và gửi lại cho Khách hàng một tài liệu tổng hợp yêu cầu để đảm bảo tôi đã hiểu đúng ý.
    - Cùng Khách hàng chốt lại phạm vi công việc (scope of work) cuối cùng.

### **Bước 2: Lập Kế hoạch và Trình bày Giải pháp**
- **Nhiệm vụ của tôi:** Vạch ra một lộ trình rõ ràng và được Khách hàng thông qua trước khi bắt đầu.
- **Hành động:**
    - Xây dựng sơ đồ trang (sitemap) và luồng người dùng (user flow).
    - Trình bày kế hoạch này cho Khách hàng duyệt.
    - Xác nhận lại công nghệ sẽ sử dụng: React (Frontend) và Supabase (Backend/Database).

### **Bước 3: Thiết kế Giao diện (UI/UX) và Chờ Phê duyệt**
- **Nhiệm vụ của tôi:** Biến ý tưởng của Khách hàng thành một thiết kế trực quan và dễ sử dụng.
- **Hành động:**
    - Bắt đầu với **Wireframe** (bản vẽ khung) để thống nhất về bố cục. Gửi cho Khách hàng duyệt.
    - Sau khi wireframe được duyệt, phát triển thành **Mockup** (thiết kế chi tiết có màu sắc, hình ảnh). Gửi cho Khách hàng duyệt.
    - (Tùy chọn) Tạo **Prototype** (bản mẫu tương tác) để Khách hàng trải nghiệm thử luồng hoạt động.
    - **Lưu ý quan trọng:** Tôi chỉ bắt đầu code sau khi Khách hàng đã hoàn toàn hài lòng và phê duyệt thiết kế cuối cùng.

### **Bước 4: Lập trình Frontend**
- **Nhiệm vụ của tôi:** Hiện thực hóa giao diện đã được duyệt một cách chính xác và tối ưu.
- **Hành động:**
    - Chuyển đổi thiết kế (mockup) thành code React.
    - Đảm bảo giao diện hoạt động tốt trên mọi kích thước màn hình (responsive).
    - Sử dụng mock data (dữ liệu ảo) để hiển thị trước.

### **Bước 5: Lập trình Backend và Database**
- **Nhiệm vụ của tôi:** Xây dựng nền tảng vững chắc cho website hoạt động.
- **Hành động:**
    - Thiết kế cơ sở dữ liệu trên Supabase.
    - Viết các API cần thiết để xử lý logic nghiệp vụ theo đúng tài liệu Supabase.
    - Thay thế mock data ở bước 4 bằng real data
    - Tích hợp hệ thống ghi log các hành động của người dùng như đã thống nhất.

### **Bước 6: Kiểm thử và Nhận Phản hồi từ Khách hàng**
- **Nhiệm vụ của tôi:** Đảm bảo sản phẩm không có lỗi trước khi ra mắt.
- **Hành động:**
    - Preview sản phẩn cho khách hàng xem và đánh giá, phản hồi.
    - Tiếp nhận phản hồi từ Khách hàng và tiến hành sửa lỗi, tinh chỉnh.

# Đây là một quy trình thiết kế chức năng tiêu chuẩn, luôn áp dụng quy trình này với mỗi yêu cầu về chức năng của user.