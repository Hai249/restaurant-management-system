# Đối chiếu bảo vệ nhánh tuần 1 — 19/11/2026

Hai ruleset đang active và áp dụng đúng `refs/heads/develop` / `refs/heads/main`. API effective rules xác nhận cả hai có pull request, một approval, yêu cầu approval sau push cuối, giải quyết review thread và hai required checks (`Build and test`, `Identity SQL Server tests`) với strict up-to-date. Ruleset main có chặn non-fast-forward; develop chưa có rule này.

Merge methods theo ruleset hiện tại đều cho phép merge/squash/rebase, trong khi [quy trình repository](../CONTRIBUTING.md) yêu cầu develop squash và main merge commit. Không coi đây là bằng chứng mọi force-push chắc chắn được phép: rule PR cũng hạn chế cập nhật; chưa thử force-push vào nhánh thật.

## Đề xuất đã chuẩn bị, chưa áp dụng

| Nhánh | Thay đổi | JSON cho chủ repo review |
|---|---|---|
| develop | Thêm `non_fast_forward`; chỉ cho squash merge | [develop ruleset](ops/develop-week1-ruleset.json) |
| main | Giữ chặn non-fast-forward; chỉ cho merge commit | [main ruleset](ops/main-week1-ruleset.json) |

Các JSON giữ nguyên conditions, required checks, approval và bypass actors đã đọc từ API; không thêm actor bypass. Người quản trị cần lấy cấu hình mới nhất và đối chiếu trước khi dùng, tránh ghi đè thay đổi của người khác sau thời điểm đề xuất.

Tài khoản kết nối Hai249 có push nhưng không có admin. Agent chưa PUT cấu hình và không thể tự cấp quyền quản trị. Không cần cấp quyền rộng chỉ để làm bước này: chủ repo có thể vào Settings → Rules → Rulesets, chọn đúng hai ruleset và sửa các mục trong bảng, giữ nguyên phần còn lại. Sau đó agent đọc API để kiểm chứng.

PR thử CI đỏ #50 đã đóng, không merge; bằng chứng lịch sử ở [GitHub controls](evidence/week-one/github-controls-2026-11-18.md). PR #52 có review APPROVED lúc 14:37:44 UTC ngày 18/11 và đã merge. Các PR #49/#54/#55/#57 đã đồng bộ develop; CI mới đạt, vẫn cần review/merge theo trạng thái thực tế. Không dùng tài khoản người khác hoặc bypass ruleset để hoàn tất.
