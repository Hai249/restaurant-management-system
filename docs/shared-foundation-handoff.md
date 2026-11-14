# HIE-1.2 implementation handoff (2026-11-14)

Status: In Review locally; no commit, push, PR or merge performed.
ADR-01 was merged in PR #29 and the owner confirmed approval. This is not a
request to approve the architecture again; implementation still needs review.

## Scope verified

- Existing BCL-only BusinessError, IdempotencyKeys, IntegrationEvent and IOutboxWriter.
- SQL Server day-lock helper using caller-owned connection/transaction.
- Architecture checks for optional pure Contracts and explicit project paths.
- Added rollback/cancellation and invalid-argument coverage; checked framework isolation.
- Imported the four C03 tests already merged in PR #28, unchanged from develop.
- Added scripts/Test-SharedFoundation.ps1 for disposable localhost SQL verification.
- No business API, schema, runtime consumer or Outbox worker changes.

## Verification

- Locked restore: passed on .NET SDK 10.0.300.
- Final runner: scripts/Test-SharedFoundation.ps1 -SkipRestore, exit 0.
- Release build: 0 warnings, 0 errors.
- Architecture: 3 passed, 0 failed, 0 skipped.
- Integration: 99 passed, 0 failed, 0 skipped, real disposable SQL Server 2022.
- Results: TestResults/FoundationCurrent/*2026-11-14_22_13_13*.trx.
- Earlier 95-test full regressions also passed before importing four upstream tests.
- Historical Identity migration timeouts did not reproduce; no Identity runtime
  changes or timeout increases were needed. This does not establish a historical root cause.
- Format verification and git diff checks are recorded in the ledger.

## Git and review boundary

The branch still starts at 17244f5; origin/develop inspected at 6db075c.
Tracked production backend sources and shared project configuration have no
upstream differences; the only upstream backend test change was the imported
PhuongWeekOneSqlServerTests.cs. This is a source compatibility check, NOT a git
merge or remote CI result. Preserve all existing uncommitted work.

Before opening the implementation PR: synchronize the branch with develop,
resolve document overlaps using the merged ADR as source, rerun the runner,
then request code review. Do not claim this branch is already synchronized.
No staging acceptance, frontend revalidation or production deployment was done.

## Repeat

Run from the repository root with Docker Engine available:

```powershell
./scripts/Test-SharedFoundation.ps1
```

The script generates a temporary password, exposes SQL only on loopback, restores
previous environment variables and removes only its own container in finally.
It does not use staging credentials or stop unrelated containers.
