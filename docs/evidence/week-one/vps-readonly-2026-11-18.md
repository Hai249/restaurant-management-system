# Bằng chứng kiểm tra VPS chỉ đọc — 18/11/2026

Nguồn: Hải chạy các lệnh sudo và cung cấp kết quả trong phiên làm việc; agent kiểm tra SSH, trạng thái service và kết nối từ máy bên ngoài VPS. Không lưu IP máy khách, khóa, mật khẩu hoặc token. Đây là ảnh chụp trạng thái tại thời điểm kiểm tra, không thay thế review/approval.

- Đăng nhập bằng khóa thành công với user `deploy`; hostname `restaurant-staging`.
- Hải chạy `sudo sshd -T`: `permitrootlogin no`, `pubkeyauthentication yes`, `passwordauthentication no`, `kbdinteractiveauthentication no`. Đây là cấu hình tổng quát; `Match` theo ngữ cảnh kết nối chưa được đối chiếu riêng.
- `sudo ufw status`: active; các rule hiển thị cho TCP 22, 80, 443 trên IPv4 và IPv6.
- `sudo fail2ban-client status`: một jail `sshd`; service fail2ban active. Chưa kiểm tra thử chặn thực tế.
- `unattended-upgrades` enabled và active. Đọc `apt-config dump` sau đó thấy `APT::Periodic::Update-Package-Lists "0"` và `APT::Periodic::Unattended-Upgrade "0"`: cơ chế APT periodic tiêu chuẩn đang tắt. Allowed-Origins có các nguồn security nhưng chỉ có service active không chứng minh cập nhật tự động hoạt động. Chưa có bằng chứng cơ chế thay thế hoặc lịch sử cập nhật thành công; INF03 không đạt yêu cầu auto-update theo cấu hình này.
- `certbot.timer` enabled; timer đã xuất hiện trong danh sách lịch. `certbot.service` chạy `/usr/bin/certbot -q renew --no-random-sleep-on-renew`; lần chạy gần nhất trả `Result=success`, `ExecMainStatus=0`. Lệnh renew có thể kết thúc 0 khi chứng chỉ chưa đến hạn, nên chưa chứng minh đã gia hạn hoặc dry-run thành công. Chưa đọc cấu hình/hook renewal bằng quyền root.
- `sudo docker ps`: API, web, Nginx và SQL Server đang Up; chỉ Nginx publish 80/443 ra host; các cổng API 8080, web 3000 và SQL 1433 được liệt kê nội bộ. Trạng thái này không thay thế quét cổng ngoài.
- DNS A của staging tại thời điểm kiểm tra trùng địa chỉ VPS đã đăng nhập SSH; HTTPS trang chủ trả 200.
- Từ máy của agent ngoài VPS, thử TCP năm cổng: 22/80/443 kết nối được; 1433/8080 không kết nối được trong thời gian chờ. Không chứng minh không có cổng khác mở; chưa thử từ mạng 4G hoặc kiểm tra riêng IPv6.

Chưa hoàn tất quét cổng ngoài, xử lý cấu hình auto-update đang tắt, renewal thực tế và cấu hình SSH theo từng `Match`. Không thay đổi SSH, firewall, container hoặc database trong các bước này.

Một phép quét TCP toàn dải được khởi động sau đó nhưng đã dừng trước khi hoàn tất khi SSH timeout; không có kết quả toàn dải để nghiệm thu. Sau dừng, HTTPS root 200 và SSH kết nối lại thành công. Không suy ra nguyên nhân timeout là do scanner khi chưa có log/đối chiếu mạng.

Theo dõi cấu hình auto-update tại [issue #53](https://github.com/Trunghieu220504/restaurant-management-system/issues/53).
