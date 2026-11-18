# Bàn giao tuần 1 — Hải, cập nhật 19/11/2026

Phạm vi: việc tuần 1 còn lại, không triển khai nhiệm vụ mới tuần 2. Trạng thái dưới đây là tiến độ và bằng chứng, không thay approval/merge hoặc nghiệm thu toàn nhóm.

Kết quả mới: [báo cáo tự động hóa 19/11](evidence/week-one/automation-2026-11-19.md) ghi nhận 243/243 backend SQL 2022 Docker sau sửa lỗi Catalog, 71/71 frontend trên develop mới, 7/7 browser/API thật cục bộ trên mốc code đã ghi, 6/6 browser staging không đăng nhập, quét đủ 65535 cổng TCP IPv4 bên ngoài và 20 × 9 test spike. Lỗi Catalog phát hiện khi kiểm tra có [PR #69](https://github.com/Trunghieu220504/restaurant-management-system/pull/69) riêng, hồi quy 20 × 2 PASS, chưa merge/deploy. [Hướng dẫn chạy lại](week-one-automation.md) kèm script và bước sudo giới hạn. E2E staging có tài khoản vẫn BLOCKED; kết quả cục bộ không thay thế nghiệm thu staging.

| Mục | Kết quả thực tế | Việc còn lại |
|---|---|---|
| PR #46 | Đã merge; review của Hiếu được ghi COMMENTED, không phải APPROVED | Không ghi ngược rằng đã có approval chính thức |
| ADR-01 phần Hải | [PR #49](https://github.com/Trunghieu220504/restaurant-management-system/pull/49) đã mở, backend checks success, đã request Hiếu review | Approval độc lập và merge |
| CI SQL Phương | Đã đọc độc lập 20 TRX trên Docker SQL 2022: 180 Passed, 0 skip; [review kỹ thuật C03](reviews/c03-hai-2026-11-19.md) | Ký kết luận spike của người phụ trách, không suy ra chốt ngày nghiệp vụ đã đạt |
| Ruleset develop | Active, đúng nhánh, một approval và hai required checks; thiếu rule non_fast_forward riêng | Chủ repo áp dụng [đề xuất cụ thể](github-week-one-controls.md): chặn force push develop, squash-only develop và merge-only main |
| PR CI đỏ | PR thử #50: required check failure, merge state blocked; đã đóng không merge | Giữ nguyên ruleset; không cần lặp lại thử nghiệm chỉ để có dấu xanh |
| Rate limit hai nguồn đồng thời | **PASS sau sửa proxy** — 13:50 UTC hai IPv4 khác nhau mỗi nguồn 10 × 400 rồi 429, đổi 5 XFF giả vẫn 429; [PR #55](https://github.com/Trunghieu220504/restaurant-management-system/pull/55), [bằng chứng](evidence/week-one/rate-limit-concurrent-2026-11-18.md) | Review/merge PR #55; INF10 tổng thể còn thiếu kiểm tra khóa tài khoản |
| VPS/DNS/HTTPS | DNS/HTTPS đạt; APT periodic 1/1, reboot=false. Sau [PR #57](https://github.com/Trunghieu220504/restaurant-management-system/pull/57), ACME staging dry-run/hook đạt và timer trỏ đúng lineage; INF06 PASS. Quét đủ TCP IPv4 từ runner GitHub chỉ thấy 22/80/443; health trước/sau đạt | Review/merge PR #54/#57; theo dõi lần renew thật tiếp theo; nguồn 4G/IPv6 chưa có bằng chứng |
| Runbook/ma trận | [PR #52](https://github.com/Trunghieu220504/restaurant-management-system/pull/52) đã APPROVED và merged; [runbook thủ công](manual-deploy-runbook.md), [INF01–INF17](test-strategy.md) ghi rõ giới hạn | Bản bổ sung automation cần review độc lập; không coi merge tài liệu là toàn bộ ca đã PASS |
| Tài khoản/E2E W1-E01–E06 | 7/7 browser/API thật đã PASS cục bộ trên SQL 2022; staging có tài khoản chưa chạy. Script chuẩn bị và payload riêng đã tải lên VPS, chưa áp dụng | Người vận hành xác nhận dữ liệu thử và chạy sudo plan/prepare theo [hướng dẫn](week-one-automation.md); agent chạy staging và cleanup đúng ba tài khoản |

## Quyền vận hành

GitHub: dùng thông tin đăng nhập Git đã lưu của Hai249, không ghi token. Có thể push nhánh fork và tạo PR; không có quyền admin ruleset. Giữ nguyên origin push bị vô hiệu hóa; không push trực tiếp develop/main.

VPS: SSH khóa bằng deploy hoạt động. Quản trị viên đã cài root-owned và cấp sudo chỉ cho [script audit cố định](../scripts/restaurant-week1-audit.sh), không đối số; audit đã chạy thành công. Deploy vẫn không có quyền Docker chung hoặc SQL write/deploy/đổi firewall qua script này. Nhãn Compose và mount đã được đối chiếu: API dùng năm file gốc và override proxy của PR #55; Nginx dùng chứng chỉ và webroot của thư mục dự án. Audit 13:49 UTC xác nhận API đã tin đúng một peer Nginx; file override chỉ thêm một biến môi trường, API/web giữ nguyên image ID và revision.

[PR #54](https://github.com/Trunghieu220504/restaurant-management-system/pull/54) cung cấp script bật lại APT periodic 1/1, giữ reboot thủ công, có backup/rollback. Quản trị viên đã áp dụng thành công; audit độc lập lúc 13:36 UTC xác nhận 1/1, kiểm tra sau áp dụng xác nhận hai timer APT enabled/active và reboot=false. Chưa có kết luận các bản vá đã được cài hoặc lịch sử cập nhật thành công. Issue #53 ghi runtime đã sửa; approval/merge PR #54 vẫn còn thiếu.

PR #57 đã được quản trị viên chạy plan/apply thành công lúc 13:48 UTC; ACME staging dry-run, kiểm tra chứng chỉ không đổi và hook reload đều đạt theo output script. Agent kiểm tra độc lập loaded ExecStart đã trỏ đúng config/work/log dirs, đúng cert-name và hook root-owned; timer enabled/active, HTTP 301 và HTTPS/health 200 với TLS verify=0. INF06 đạt; không coi dry-run là bằng chứng lần renew production tiếp theo đã xảy ra. Backup chỉ lưu trên VPS, không đưa log/key vào Git.

Không sửa lịch sử Git để xóa địa chỉ IP; bản cập nhật chỉ ẩn IP trong nội dung tài liệu hiện tại. Địa chỉ cũ vẫn có thể xem trong lịch sử/PR; chủ repo quyết định việc xử lý lịch sử nếu cần. Không có kết luận đã quét sạch secret toàn bộ lịch sử.
