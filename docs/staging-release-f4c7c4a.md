# Staging release f4c7c4a

Runtime source: merged develop `f4c7c4a87a031f4567f883fd908ff9517c2e601e`, including Duy's frontend usability PR #75. No PR was merged by the deployment operator.

## Verified inputs

- Backend/SQL/image publication: [run 44474225736](https://github.com/Trunghieu220504/restaurant-management-system/actions/runs/44474225736), all jobs successful.
- Web: [run 44474225744](https://github.com/Trunghieu220504/restaurant-management-system/actions/runs/44474225744), successful.
- Security: [run 44474225730](https://github.com/Trunghieu220504/restaurant-management-system/actions/runs/44474225730), successful.
- API: `ghcr.io/trunghieu220504/restaurant-api@sha256:b18965d150cb69b398531ed874e831aae0a3c948118d5896589ccca715b2501b`.
- Web: `ghcr.io/trunghieu220504/restaurant-web@sha256:1be07da1fb3161d1ae87703ba53f7d8a3c0e63c689567c09929b9e72b3581337`.
- Public Linux amd64 image configuration labels independently verified from the VPS: both revisions exactly match the source above.
- Deploy helper SHA-256: `cadc1eea137beeff61c887c7a4c8f25c7d9d0fc234241bc302eff9c4a36c2c4d`.
- Installer SHA-256: `486dff19ce4934e278aaf00c9c1e586881519b884c7be81989fe3262fd6c36b3`.

The deploy helper is the merged #73 helper with only revision, release path/name and image digest substitutions. The UTF-8/BOM SQL transport and backup/restore/rollback checks are retained. There are no migration or infra changes between the earlier runtime 95ab29b and this source; original Seating/Sales SQL checksums are unchanged. Inputs uploaded under `/home/deploy/restaurant-release-f4c7c4a` passed remote checksum and Bash syntax checks; installer rejects non-root/arguments.

## One-time operator installation

Run inside the existing SSH session (not Windows PowerShell):

```bash
sudo bash /home/deploy/restaurant-release-f4c7c4a/install-approved-staging-f4c7c4a.sh
```

The installer verifies fixed helper/SQL hashes after copying to a root-private candidate directory. It copies the existing root-owned 95ab29b Compose configuration, runs a read-only plan, and installs only a no-argument sudo wrapper for this fixed release. No account helper, broad Docker/shell grant, environment edit or deployment runs during installation. Do not run the earlier 95ab29b repair first; this release includes that fix.

After a successful installation, the authorized deployment operator can run:

```bash
sudo -n /usr/local/sbin/restaurant-deploy-approved-f4c7c4a
```

That command performs backup + CHECKSUM + VERIFYONLY, isolated restore, two migration passes, CHECKDB, isolated API readiness, staging migration, API/Web replacement and public readiness/revision checks. SQL and Nginx container IDs must be unchanged. On failure after image replacement it attempts to restore the previous API/Web images, without schema downgrade. Evidence and previous image IDs are root-private under the printed backup directory.

## Acceptance status

At bundle preparation, staging still reported Healthy on the previous runtime. Root installation, actual deployment, post-deploy account verification and browser acceptance are **pending**; successful CI/input validation does not prove deployment occurred. Existing Manager/Staff accounts must be verified without resetting their passwords or publishing credentials.
