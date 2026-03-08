# GitHub Actions Workflows

This document explains how to use the GitHub Actions workflows configured for YACS CLI.

## Workflows

### 1. Tests (`test.yml`)

**Trigger:**
- Push to `main` branch
- Pull requests to `main` branch
- Only when files in `cli/` directory change

**What it does:**
- Runs on self-hosted runner
- Installs dependencies
- Executes `npm test` (31 tests with Mocha + Chai)
- Uploads test artifacts

**Status badge:**
```markdown
![Tests](https://github.com/munchkin09/YACS/actions/workflows/test.yml/badge.svg)
```

---

### 2. Publish Package (`publish.yml`)

**Trigger:**
- When you push a version tag matching pattern `v*.*.*`
  - Examples: `v1.0.0`, `v1.2.3-beta`, etc.

**What it does:**
- Runs on self-hosted runner
- Verifies all tests pass
- Updates package version to match tag
- Publishes to GitHub Packages as `@munchkin09/yacs-installer`
- Creates a GitHub Release with publish confirmation

**Registry:** [GitHub Packages](https://github.com/munchkin09/YACS/packages)

---

## How to Release

### Step 1: Create a version tag

```bash
# From root of repository
git tag v1.0.1
git push origin v1.0.1
```

### Step 2: Watch the workflow

Go to [Actions tab](https://github.com/munchkin09/YACS/actions) and monitor the publish workflow.

### Step 3: Verify publication

Once published, install with:

```bash
npm install @munchkin09/yacs-installer
```

Or use it from GitHub Packages registry in your project's `.npmrc`:

```
@munchkin09:registry=https://npm.pkg.github.com
```

---

## Self-Hosted Runner Setup

The workflows use `self-hosted` runner. To use them:

1. **Configure the runner** in repository settings:
   - Go to Settings → Actions → Runners
   - Click "New self-hosted runner"
   - Follow GitHub's instructions for your OS
   - Label it or use default

2. **Verify runner is online:**
   ```bash
   # The runner will show "Idle" in the Actions page
   ```

3. **Runner automatically executes workflows** that match `runs-on: self-hosted`

---

## Package Details

- **Name:** `@munchkin09/yacs-installer`
- **Registry:** GitHub Packages (`npm.pkg.github.com`)
- **Scope:** `@munchkin09`
- **Bin entry:** `yacs` command globally available

### Installation methods:

```bash
# Method 1: Direct from GitHub Packages (requires auth token)
npm install @munchkin09/yacs-installer

# Method 2: Clone and use locally
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm start
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Runner offline | Check runner process on self-hosted machine |
| Tests fail | Review test output in Actions tab → workflow run details |
| Publish failed | Verify package.json version matches tag (workflow auto-updates it) |
| Registry auth error | Ensure `GITHUB_TOKEN` is available (auto-provided by GitHub Actions) |

---

## Next Steps

- [ ] Verify self-hosted runner is configured
- [ ] Create first version tag: `git tag v1.0.0 && git push origin v1.0.0`
- [ ] Monitor publish workflow completion
- [ ] Test installation: `npm install @munchkin09/yacs-installer`
