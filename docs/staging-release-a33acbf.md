# Approved develop release a33acbf — HAI-2.5 preparation

This is one fixed release, **not completed automatic CD or week-three acceptance**.
Source: merged develop `a33acbfa52cb73407fa1742bb64f078f79f4b2a7`,
[successful build/publish](https://github.com/Trunghieu220504/restaurant-management-system/actions/runs/44440263321).
Only a member merges PRs; the agent must never merge or enable auto-merge.
Coordination and remaining dependencies are tracked in [#70](https://github.com/Trunghieu220504/restaurant-management-system/issues/70).

## Immutable inputs

| Input | SHA256 |
| --- | --- |
| API image index, ghcr.io/trunghieu220504/restaurant-api | `9a41177be9af184f7d1544752ab86d3fa9832d9db169c57d32cac7ab4d9d215d` |
| Web image index, ghcr.io/trunghieu220504/restaurant-web | `a387e7eea077ab4ba994c4cac5d2f1fadff4808e24323d8d298b43d992597ce9` |
| seating.sql | `574e35a3dbbad08afff2e76d0ac9d8ee85a9ec2b8400df06f3350b27817c79a2` |
| sales.sql | `458b581c151c6eafb96c92513b5b29b9d6b37f80281906b8ff1bfef2585068af` |

Migrations are additive (new Seating idempotency table and initial Sales schema). Regenerate SQL
from that exact commit, using the Infrastructure project as both project and startup project:
`dotnet ef migrations script --idempotent --context SeatingDbContext --project src/Modules/Seating/Restaurant.Modules.Seating.Infrastructure --startup-project src/Modules/Seating/Restaurant.Modules.Seating.Infrastructure --configuration Release --output artifacts/release-a33acbf/seating.sql`.
For Sales substitute `Sales`, `SalesDbContext` and `sales.sql`. The design-time factory requires
`ConnectionStrings__Restaurant`; script generation can use an offline dummy local connection.
Do not put a staging connection secret into command history.
These hashes use UTF-8 BOM and CRLF as generated on Windows. The tooling workflow regenerates
from the exact merged revision on Linux and canonicalizes those bytes before comparing checksums.
Its syntax/guard/ShellCheck/credential checks do not exercise a live deploy or prove rollback success.

## Operator bootstrap and bounded operation

The dirty operator checkout is not reset or pulled. Existing live Compose files/environment are
snapshotted into root-owned mode-0700 directories; neither a mutable deploy-owned shell nor mutable
Compose input is used by the sudo helpers. SQL files must match the fixed checksums above.
The runtime script only accepts this exact release and fixed service names.

An operator reviews [deploy](../scripts/restaurant-deploy-a33acbf.sh),
[account provisioning](../scripts/restaurant-staging-create-accounts.sh) and
[installer](../scripts/install-approved-staging-release.sh), then runs on the VPS:

```bash
sudo bash /home/deploy/restaurant-release-a33acbf/install-approved-staging-release.sh
```

This installs and validates the **plan only** and grants exactly two root-owned, no-argument helpers.
It does not grant a shell, arbitrary Docker access, repository write access or a configurable release.
After bootstrap the authorized agent can run:

```bash
sudo -n /usr/local/sbin/restaurant-deploy-approved-a33acbf
sudo -n /usr/local/sbin/restaurant-create-staging-accounts
```

Deployment locks against concurrent runs, creates COPY_ONLY/CHECKSUM backup and VERIFYONLY,
restores into a unique `RestaurantReleaseVerify_...` DB without REPLACE, applies both SQL scripts
twice on that copy, CHECKDBs it and tests the new API's readiness against it using an unpublished
probe container. Scratch DB/container cleanup is bounded to those exact generated identifiers.
Then it applies additive migrations to staging and recreates only API/Web, tests/reloads Nginx and
verifies HTTPS/readiness, image revisions, and unchanged SQL/Nginx container IDs. Errors after an
image switch trigger restoration of the recorded previous local image IDs and readiness checks.
Schema is retained; there is no automatic migration downgrade or staging database restore.
Private backup/logs and the current pinned image state remain root-only on the VPS.

Two new accounts are fixed to `staging.manager` / Manager and `staging.staff` / Staff.
The generator uses Identity's actual password hasher and self-verifies both hashes. Only hashes/IDs
go to the provisioning payload. Any existing ID, username or email collision stops without changing
an existing account. Both insertions share a SERIALIZABLE transaction after backup verification.
There is no Admin bootstrap, role-permission expansion or SalesDay mutation.
Passwords stay in an ignored private Windows folder and are delivered only to Hải after login/role
checks. Generated credentials are NOT usable until provisioning and actual login have passed.

## Evidence and remaining work

Prepared locally: locked restore/build, 5 architecture tests, 150 non-SQL tests (outside the Windows
EventLog sandbox restriction), regenerated/checksummed SQL, Bash syntax checks and self-verified
password hashes. These do not substitute actual VPS plan/restore/migration/rollback/deploy evidence.

Still required: root bootstrap, live deploy, real account login/permission checks, Duy's approved
authenticated smoke, a controlled rollback exercise, restricted SSH CD key/GitHub environment secrets,
and automatic CD execution. R2 credentials/buckets and daily backup + isolated restore remain separate
HAI-2.2/2.6 work. Financial UI is currently a mock; full HAI-3.2 depends on owners' actual Sales/Billing APIs.
No deployment or authenticated smoke is marked PASS by creating this PR.
