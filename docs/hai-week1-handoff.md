# Bàn giao tuần 1 — Hải, 18/11/2026

Phạm vi: việc tuần 1 còn lại, không triển khai nhiệm vụ mới tuần 2. Trạng thái dưới đây là tiến độ và bằng chứng, không thay approval/merge hoặc nghiệm thu toàn nhóm.

| Mục | Kết quả thực tế | Việc còn lại |
|---|---|---|
| PR #46 | Đã merge; review của Hiếu được ghi COMMENTED, không phải APPROVED | Không ghi ngược rằng đã có approval chính thức |
| ADR-01 phần Hải | [PR #49](https://github.com/Trunghieu220504/restaurant-management-system/pull/49) đã mở, backend checks success, đã request Hiếu review | Approval độc lập và merge |
| CI SQL Phương | Đọc TRX, 9/9 Passed, không skip; xem [bằng chứng GitHub](evidence/week-one/github-controls-2026-11-18.md) | Ký kết luận spike của người phụ trách, không suy ra chốt ngày nghiệp vụ đã đạt |
| Ruleset develop | Active, đúng nhánh, một approval và hai required checks | Chủ repo đối chiếu rule force-push riêng và quy định merge methods |
| PR CI đỏ | PR thử #50: required check failure, merge state blocked; đã đóng không merge | Giữ nguyên ruleset; không cần lặp lại thử nghiệm chỉ để có dấu xanh |
| Rate limit hai nguồn đồng thời | **FAIL**, [issue #51](https://github.com/Trunghieu220504/restaurant-management-system/issues/51); API thiếu KnownProxies, đã đối chiếu đúng Compose/mount và chuẩn bị [PR #55](https://github.com/Trunghieu220504/restaurant-management-system/pull/55), hai required checks success | Quản trị viên chạy plan/apply rồi retest hai nguồn và spoofed XFF; không tắt limiter |
| VPS/DNS/HTTPS | DNS/HTTPS đạt; APT periodic đã sửa và audit xác nhận 1/1, reboot=false. Phát hiện timer Certbot đọc sai config-dir, [issue #56](https://github.com/Trunghieu220504/restaurant-management-system/issues/56), bản sửa [PR #57](https://github.com/Trunghieu220504/restaurant-management-system/pull/57) | Dry-run và sửa lịch renewal bằng root; quét ngoài đầy đủ còn thiếu. Xem [bằng chứng](evidence/week-one/vps-readonly-2026-11-18.md) |
| Runbook/ma trận | [Runbook thủ công](manual-deploy-runbook.md), [INF01–INF17](test-strategy.md) ghi rõ phần đạt, FAIL và chặn | Review/merge và xác nhận chiến lược kiểm thử của nhóm |
| Tài khoản/E2E W1-E01–E06 | Runbook tài khoản test đã merge #48; chưa tạo tài khoản hoặc đổi dữ liệu trong phiên kiểm tra này | Xác nhận staging là dữ liệu test được phép, backup trước tạo tài khoản, thống nhất dữ liệu SalesDay, rồi nghiệm thu browser thật |

## Quyền vận hành

GitHub: dùng thông tin đăng nhập Git đã lưu của Hai249, không ghi token. Có thể push nhánh fork và tạo PR; không có quyền admin ruleset. Giữ nguyên origin push bị vô hiệu hóa; không push trực tiếp develop/main.

VPS: SSH khóa bằng deploy hoạt động. Quản trị viên đã cài root-owned và cấp sudo chỉ cho [script audit cố định](../scripts/restaurant-week1-audit.sh), không đối số; audit đã chạy thành công. Deploy vẫn không có quyền Docker chung hoặc SQL write/deploy/đổi firewall qua script này. Nhãn Compose và mount đã được đối chiếu: API dùng năm file hiện có; Nginx dùng chứng chỉ và webroot của thư mục dự án. PR #55 chỉ thêm đúng IP peer Nginx vào cấu hình API; preview Compose chỉ khác một biến môi trường, chưa áp dụng.

[PR #54](https://github.com/Trunghieu220504/restaurant-management-system/pull/54) cung cấp script bật lại APT periodic 1/1, giữ reboot thủ công, có backup/rollback. Quản trị viên đã áp dụng thành công; audit độc lập lúc 13:36 UTC xác nhận 1/1, kiểm tra sau áp dụng xác nhận hai timer APT enabled/active và reboot=false. Chưa có kết luận các bản vá đã được cài hoặc lịch sử cập nhật thành công. Issue #53 ghi runtime đã sửa; approval/merge PR #54 vẫn còn thiếu.

PR #57 đã tải script lên VPS, cú pháp Bash đạt và SHA256 bản tải trùng nguồn. Root plan/apply, ACME staging dry-run và kiểm tra sau áp dụng vẫn chưa thực hiện. Timer Certbot enabled/active hiện tại không đủ để đánh dấu INF06 đạt.

Không sửa lịch sử Git để xóa địa chỉ IP; bản cập nhật chỉ ẩn IP trong nội dung tài liệu hiện tại. Địa chỉ cũ vẫn có thể xem trong lịch sử/PR; chủ repo quyết định việc xử lý lịch sử nếu cần. Không có kết luận đã quét sạch secret toàn bộ lịch sử.
