# Bàn giao tuần 1 — Hải, 18/11/2026

Phạm vi: việc tuần 1 còn lại, không triển khai nhiệm vụ mới tuần 2. Trạng thái dưới đây là tiến độ và bằng chứng, không thay approval/merge hoặc nghiệm thu toàn nhóm.

| Mục | Kết quả thực tế | Việc còn lại |
|---|---|---|
| PR #46 | Đã merge; review của Hiếu được ghi COMMENTED, không phải APPROVED | Không ghi ngược rằng đã có approval chính thức |
| ADR-01 phần Hải | [PR #49](https://github.com/Trunghieu220504/restaurant-management-system/pull/49) đã mở, backend checks success, đã request Hiếu review | Approval độc lập và merge |
| CI SQL Phương | Đọc TRX, 9/9 Passed, không skip; xem [bằng chứng GitHub](evidence/week-one/github-controls-2026-11-18.md) | Ký kết luận spike của người phụ trách, không suy ra chốt ngày nghiệp vụ đã đạt |
| Ruleset develop | Active, đúng nhánh, một approval và hai required checks | Chủ repo đối chiếu rule force-push riêng và quy định merge methods |
| PR CI đỏ | PR thử #50: required check failure, merge state blocked; đã đóng không merge | Giữ nguyên ruleset; không cần lặp lại thử nghiệm chỉ để có dấu xanh |
| Rate limit hai nguồn đồng thời | **FAIL**, đã mở [issue #51](https://github.com/Trunghieu220504/restaurant-management-system/issues/51); hai nguồn chia tổng 10 request trong phép thử | Audit proxy đang chạy, sửa theo quy trình và retest; không tắt limiter |
| VPS/DNS/HTTPS | Có [bằng chứng chỉ đọc](evidence/week-one/vps-readonly-2026-11-18.md), DNS trùng VPS, HTTPS 200; cấu hình APT periodic tự cập nhật đang bằng 0, INF03 FAIL | Audit có quyền root giới hạn, xử lý auto-update, xác minh renewal và quét ngoài đầy đủ |
| Runbook/ma trận | [Runbook thủ công](manual-deploy-runbook.md), [INF01–INF17](test-strategy.md) ghi rõ phần đạt, FAIL và chặn | Review/merge và xác nhận chiến lược kiểm thử của nhóm |
| Tài khoản/E2E W1-E01–E06 | Runbook tài khoản test đã merge #48; chưa tạo tài khoản hoặc đổi dữ liệu trong phiên kiểm tra này | Xác nhận staging là dữ liệu test được phép, backup trước tạo tài khoản, thống nhất dữ liệu SalesDay, rồi nghiệm thu browser thật |

## Quyền vận hành

GitHub: dùng thông tin đăng nhập Git đã lưu của Hai249, không ghi token. Có thể push nhánh fork và tạo PR; không có quyền admin ruleset. Giữ nguyên origin push bị vô hiệu hóa; không push trực tiếp develop/main.

VPS: SSH khóa bằng deploy hoạt động. Sudo cần mật khẩu, deploy không truy cập trực tiếp Docker. [Script audit cố định](../scripts/restaurant-week1-audit.sh) đã chuẩn bị để quản trị viên kiểm tra/cài root-owned và cấp sudo chỉ đúng đường dẫn, không đối số. Chưa cấp quyền SQL write, deploy hoặc đổi firewall bằng script này.

Không sửa lịch sử Git để xóa địa chỉ IP; bản cập nhật chỉ ẩn IP trong nội dung tài liệu hiện tại. Địa chỉ cũ vẫn có thể xem trong lịch sử/PR; chủ repo quyết định việc xử lý lịch sử nếu cần. Không có kết luận đã quét sạch secret toàn bộ lịch sử.
