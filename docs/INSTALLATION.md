# Installation Guide

This guide covers all installation scenarios for Instructify.

## 📦 Quick Install

### Option 1: NPM Package (Recommended)

```bash
# Install the package
npm install instructify

# Initialize in your project
npx instructify init

# Verify Cursor compatibility
npx instructify verify
```

### Option 2: Git Repository (For Development)

```bash
# Clone the repository
git clone https://github.com/kanishka-namdeo/instructify.git
cd instructify

# Install dependencies
npm install

# Manually copy .cursor/ to your project
cp -r .cursor /path/to/your/project/
```

## 🔧 Installation Scenarios

### Scenario 1: Fresh Project Setup

**You have:** A new project with no Cursor configuration

**Steps:**

```bash
# 1. Install Instructify
npm install instructify

# 2. Initialize
npx instructify init

# 3. Install hook dependencies (optional, for validation)
npm install -D tsx typescript eslint @eslint/js \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  typescript-eslint globals

# 4. Add scripts to package.json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  }
}

# 5. Open project in Cursor IDE
```

**Result:** Full Instructify setup with validation hooks

### Scenario 2: Existing Cursor Project

**You have:** An existing Cursor project with some configuration

**Steps:**

```bash
# 1. Install Instructify
npm install instructify

# 2. Backup existing .cursor/ folder (if any)
mv .cursor .cursor.backup

# 3. Initialize
npx instructify init

# 4. Merge configurations if needed
# - Compare .cursor/hooks.json with your old config
# - Restore any custom MCP server configurations
```

**Result:** Instructify configuration with your customizations preserved

### Scenario 3: Hooks Only (Minimal Setup)

**You want:** Just the automated validation hooks

**Steps:**

```bash
# 1. Install dependencies
npm install -D tsx typescript eslint

# 2. Copy only the hooks folder
mkdir -p .cursor/hooks
cp -r node_modules/instructify/.cursor/hooks/* .cursor/hooks/

# 3. Create minimal hooks.json
cat > .cursor/hooks.json << 'EOF'
{
  "version": 1,
  "hooks": {
    "after_code_change": [
      {
        "command": "npx tsx .cursor/hooks/auto-lint-fix.ts",
        "runtime": "node"
      },
      {
        "command": "npx tsx .cursor/hooks/auto-validate.ts",
        "runtime": "node"
      }
    ]
  }
}
EOF

# 4. Add package.json scripts
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.lint:fix="eslint . --fix"
npm pkg set scripts.typecheck="tsc --noEmit"
```

**Result:** Automated hooks without full Instructify configuration

### Scenario 4: Plan Tracking Only

**You want:** Just the plan quality tracking

**Steps:**

```bash
# 1. Install tsx only
npm install -D tsx

# 2. Copy plan tracker hook
mkdir -p .cursor/hooks
cp node_modules/instructify/.cursor/hooks/plan-quality-tracker.ts .cursor/hooks/

# 3. Create minimal hooks.json
cat > .cursor/hooks.json << 'EOF'
{
  "version": 1,
  "hooks": {
    "plan_mode_exit": [
      {
        "command": "npx tsx .cursor/hooks/plan-quality-tracker.ts",
        "runtime": "node"
      }
    ]
  }
}
EOF
```

**Result:** Plan tracking without validation overhead

## 🎯 Platform-Specific Installation

### Windows

```bash
# Using npm (recommended)
npm install instructify

# Initialize
npx instructify init

# If you get permission errors, run PowerShell as Administrator
```

### macOS

```bash
# Using npm
npm install instructify

# If you get permission errors with global installs
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Linux

```bash
# Using npm
npm install instructify

# On Ubuntu/Debian, you might need to install Node.js first
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 📋 Prerequisites Checklist

Before installing, verify you have:

- [ ] **Cursor IDE** >= 0.40.0 ([Download](https://cursor.com))
- [ ] **Node.js** >= 20.0.0 (`node --version`)
- [ ] **npm** >= 9.0.0 (`npm --version`)

### Optional (For Full Features)

- [ ] **TypeScript** (`npm install -D typescript`)
- [ ] **ESLint** (`npm install -D eslint @eslint/js`)
- [ ] **tsx** (`npm install -D tsx`)

## 🔍 Verifying Installation

### Check Package Installation

```bash
# Verify package is installed
npm list instructify

# Should show:
# instructify@1.0.0
```

### Check Cursor Compatibility

```bash
# Run verify command
npx instructify verify

# Should confirm Cursor version compatibility
```

### Test Hook Execution

```bash
# Test that hooks can run
npx tsx .cursor/hooks/auto-lint-fix.ts --help

# Should not throw errors (may show help or skip due to missing input)
```

### Verify Configuration

```bash
# Check .cursor folder exists
ls -la .cursor/

# Should contain:
# - hooks.json
# - hooks/
# - rules/
# - skills/
```

## 🐛 Troubleshooting Installation

### Issue: "Cannot find module 'instructify'"

**Solution:**
```bash
# Reinstall package
npm uninstall instructify
npm install instructify

# Clear npm cache if needed
npm cache clean --force
npm install instructify
```

### Issue: "tsx: command not found"

**Solution:**
```bash
# Install tsx globally
npm install -g tsx

# Or use npx
npx tsx .cursor/hooks/auto-lint-fix.ts
```

### Issue: "Permission denied" on macOS/Linux

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or configure npm to use user directory
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Hooks don't run in Cursor

**Solution:**
1. Check Cursor version: Help > About (must be >= 0.40.0)
2. Verify `.cursor/hooks.json` exists
3. Check hook file permissions (should be readable)
4. Restart Cursor IDE

### Issue: ESLint errors after installation

**Solution:**
```bash
# Install ESLint dependencies
npm install -D eslint @eslint/js @typescript-eslint/*

# Or disable linting in hooks.config.json
echo '{
  "validation": {
    "enableLint": false
  }
}' > .cursor/hooks.config.json
```

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Install TypeScript
npm install -D typescript

# Create minimal tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true
  }
}
EOF
```

## 🔄 Updating Installation

### Update from Older Version

```bash
# Check current version
npm list instructify

# Update to latest
npm update instructify

# Or install specific version
npm install instructify@latest
```

### Migration Guide (v0.x to v1.0)

If you're upgrading from a development version:

```bash
# 1. Backup existing configuration
cp -r .cursor .cursor.backup

# 2. Update package
npm install instructify@latest

# 3. Review breaking changes in CHANGELOG.md

# 4. Re-initialize if needed
npx instructify init
```

## 📊 Installation Size

### Package Size

- **Download size:** ~100 kB
- **Installed size:** ~500 kB
- **With dependencies:** ~50 MB (if installing all dev dependencies)

### Disk Space Requirements

- **Minimum:** 1 MB (package only)
- **Recommended:** 100 MB (with all dependencies)

## 🎓 Next Steps

After installation:

1. **Read the README** - [Main documentation](../README.md)
2. **Configure MCP servers** - See [MCP Integration Guide](MCP-INTEGRATION-GUIDE.md)
3. **Customize hooks** - Edit `.cursor/hooks.config.json`
4. **Test the setup** - Make a code change and watch hooks run

## 📞 Getting Help

If you encounter installation issues:

1. Check [troubleshooting section](#troubleshooting-installation) above
2. Review [GitHub Issues](https://github.com/kanishka-namdeo/instructify/issues)
3. Open a new issue with:
   - Your OS and Node.js version
   - Error messages
   - Steps you've tried

---

**Installation should be smooth. If it's not, we're here to help!**
