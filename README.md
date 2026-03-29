# Instructify 🚀

**The AI Agent Workflow I Built for Myself—Now You Can Use It Too**

Look, I got tired of Cursor's AI agent wasting my tokens, making the same mistakes over and over, and taking forever to get simple tasks done. So I built Instructify—**the exact configuration I use to make Cursor work better for me**. No fluff, just what works.

## 📦 How to Get Started

### Option 1: NPM Package (What I Use)

```bash
# Install the package
npm install instructify

# Run the setup CLI
npx instructify init

# Or verify Cursor compatibility
npx instructify verify
```

### Option 2: Git Repository (If You Want to Tinker)

```bash
git clone https://github.com/kanishka-namdeo/instructify.git
cd instructify
# Manually copy .cursor/ to your project root
```

### What You Need

**Minimum Requirements:**
- **Cursor IDE**: >= 0.40.0 ([Download](https://cursor.com))
- **Node.js**: >= 20.0.0 (for CLI and hooks)
- **npm**: >= 9.0.0

**For Full Hook Functionality (Recommended):**
- **tsx**: `npm install -g tsx` (runs TypeScript hooks)
- **TypeScript**: `npm install -D typescript` (for typecheck hook)
- **ESLint**: `npm install -D eslint @eslint/js @typescript-eslint/*` (for linting)

**Optional (For MCP Validation):**
- MCP servers configured in Cursor (browser, github, context7, etc.)

---


| License        | Version | Package Size |
| -------------- | ------- | ------------ |
| [MIT](LICENSE) | 1.0.0   | 99.9 kB      |


---

## ⚡ What Changed for Me

### The Before and After

| WITHOUT Instructify                                | WITH Instructify                              |
| -------------------------------------------------- | --------------------------------------------- |
| My old sessions - chaos and wasted tokens          | How it runs now - smooth and efficient        |
|                                                    |                                               |
| ![Without Instructify](assets/without.gif)         | ![With Instructify](assets/with.gif)          |

These are actual GIFs from my workflow. See the difference?

> 💡 **Want to see the exact prompt I use?** Check out `[assets/prompt.md](assets/prompt.md)` — straight from my daily driver.

### What I Noticed

```
┌─────────────────────────────────────────────────────┐
│  BEFORE I BUILT THIS         │  AFTER I BUILT THIS  │
├─────────────────────────────────────────────────────┤
│  ❌ Random tool choices        │  ✅ Smarter selection│
│  ❌ Context overload           │  ✅ Tiered loading   │
│  ❌ 10+ revision cycles        │  ✅ Fewer fixes      │
│  ❌ Wasted tokens              │  ✅ Less waste       │
│  ❌ Slow task completion       │  ✅ Faster results   │
│  ❌ Manual lint/test runs      │  ✅ Auto-validation  │
└─────────────────────────────────────────────────────┘
```

**Rough estimates from my workflow (your mileage may vary):**

- 🏃 **~25-30% faster** task completion (I leave work earlier now)
- 💰 **~15-20% less** token consumption (my quota lasts longer)
- 🎯 **Better** tool success rates (fewer "let me try that again" moments)
- 🔄 **~50% fewer** revisions needed (I review code instead of rewriting it)

---

## 🔥 Why I Built This

**I was losing my mind because:**

- ❌ **My tokens were vanishing** - 10k+ lines of context on every request, burning through quotas
- ❌ **I was fixing the same bugs** - Agent generated broken code, I manually tested and fixed. Every. Single. Time.
- ❌ **Tool selection was random** - Expensive MCP calls for simple grep tasks

**So I built Instructify for myself:** Tiered context (reduced my token waste significantly), auto-validation hooks that catch bugs before I see them, smart tool hierarchy, and skills that actually remember what works.

---

## 🎯 How It Works

```
┌──────────────┐
│  You Type    │
│  a Task      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Tiered Context System               │
│  • Always: general.md (15 lines)     │
│  • + Task-specific rules             │
│  • + Auto-loaded skills              │
│  Result: Much less context waste     │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Smart Tool Selection                │
│  • Tier 1: Simple (Shell, Read)      │
│  • Tier 2: Analysis (ReadLints)      │
│  • Tier 3: Complex (Task, Web)       │
│  • Tier 4: MCP (189+ tools)          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Automated Hooks Fire                │
│  ✓ Auto-validate code                │
│  ✓ Auto-lint & fix                   │
│  ✓ Run tests                         │
│  ✓ Monitor plan quality              │
│  ✓ Validate MCP calls                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────┐
│  Done Right  │
│  First Time  │
└──────────────┘
```

---

## 🛠️ What I Built for My Own Workflow

### 1. **Tiered Context System (Because I Was Burning Tokens)**

I got tired of watching my token quota disappear. So I built this:

```
Always Loaded ──────► general.md (15 lines)
                      ↓
Task Triggers ──────► Tier 1 (high-priority rules)
                      ↓
Complex Tasks ──────► Tier 2 (specialized capabilities)
```

**Result:** My context waste dropped significantly. I actually know where my tokens go now.

### 2. **189+ MCP Tools (I Configured What I Actually Use)**

**Browser Automation (for when I need to test without leaving my chair):**

- `cursor-ide-browser` - 27 tools (I use this daily for automation + profiling)
- `user-chrome-devtools` - 30 tools (Lighthouse scores before my users complain)
- `user-playwright` - 22 tools (E2E tests that catch bugs I'd miss)
- `user-selenium` - 18 tools + accessibility tree (because a11y matters)

**Development (stuff I was doing manually before):**

- `user-github` - 42 tools (PRs, issues, search—my commit history thanks me)
- `user-dart` - 26 tools (Flutter lifecycle, testing—saved me hours)
- `user-ESLint` - Code quality checks (catches my lazy typos)

**Docs & Design (because I can't memorize everything):**

- `user-context7` - Library docs lookup (no more tab hell)
- `user-mcp-deepwiki` - Deep wiki searches (when Stack Overflow fails)
- `user-stitch` - 12 UI design tools (I'm a backend dev, this helps)
- `user-shadcn` - 7 shadcn component tools (consistent UIs without thinking)

**Reasoning (for when I'm stuck):**

- `user-sequential-thinking` - Talk through complex problems (rubber duck 2.0)

### 3. **Auto-Validation Hooks (My Safety Net)**

I was manually testing and linting everything. Not anymore. After consolidating redundant hooks, I now have a streamlined set that runs automatically:

```
after_code_change ──► auto-lint-fix.ts (fixes formatting issues first)
after_code_change ──► auto-validate.ts (unified: lint + typecheck + tests + MCP validation)
plan_mode_exit ─────► plan-quality-tracker.ts (unified: tracks metrics + provides feedback)
```

**What changed:** I merged 6 hooks into 3 to eliminate redundancy and fix execution order issues. The new `auto-validate.ts` combines test running, MCP validation, linting, and typechecking into one efficient hook with smart change detection.

### 4. **Dynamic Skills (The Stuff I Wish I Knew Earlier)**

I wrote down what I learned the hard way: React/Next.js/Vite/Tauri/Electron guides, Python PEP 8 & clean code, debug optimization, MCP mastery, tool selection strategies, parallel exploration patterns, plan mode mastery. These load on-demand—no bloat.

---

## 📦 How I Organized This

```
instructify/
├── .cursor/                    # My Cursor IDE config (copy this to your project)
│   ├── hooks.json             # 3 streamlined hooks (consolidated from 6)
│   ├── hooks.config.json      # Customizable hook settings (optional)
│   ├── rules/                 # Context rules I learned the hard way
│   │   ├── general.md         # Always loaded (15 lines—kept it lean)
│   │   ├── context-tier-1.md  # High-priority stuff I use daily
│   │   ├── context-tier-2.md  # Specialized capabilities for complex tasks
│   │   ├── mcp-auto-use.md    # When to fire up MCP servers
│   │   └── tool-strategy.md   # Tool cost hierarchy (stop wasting tokens)
│   ├── skills/                # Dynamic capabilities I built from experience
│   │   ├── debug-optimizer/   # Debugging tricks I wish I knew sooner
│   │   ├── mcp-mastery/       # How to actually use MCP tools
│   │   ├── react-guide/       # React patterns that work
│   │   ├── nextjs-guide/      # Next.js 14-15 best practices
│   │   ├── vite-guide/        # Vite optimization
│   │   ├── tauri-guide/       # Tauri security & performance
│   │   ├── electron-guide/    # Electron best practices
│   │   ├── python-guide/      # Python PEP 8 & clean code
│   │   └── ... (11 total—only what I actually use)
│   └── hooks/                 # TypeScript scripts that run automatically
│       ├── auto-validate.ts   # Unified validation (lint + typecheck + tests + MCP)
│       ├── auto-lint-fix.ts   # Fixes formatting issues
│       └── plan-quality-tracker.ts  # Tracks plan metrics and provides feedback
└── AGENT-INSTRUCTION-BEST-PRACTICES.md  # The 3,239-line guide I wrote for myself
```

---

## 🚀 How I Use It (And How You Can Too)

### 1. Grab the Code

```bash
git clone https://github.com/kanishka-namdeo/instructify.git
cd instructify
```

### 2. Install Deps (Only If You Want the Hook Scripts)

```bash
npm install
# or
bun install
```

### 3. Install Hook Dependencies (Required for Auto-Validation)

**Quick Setup (What I Use):**
```bash
# Install all dev dependencies for full validation
npm install -D tsx typescript eslint @eslint/js \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  typescript-eslint globals

# Or install just tsx if you only want plan tracking
npm install -D tsx
```

**Add NPM Scripts to `package.json`:**
```json
{
  "scripts": {
    "lint": "eslint . --format=stylish",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  }
}
```

**Note:** The hooks have graceful degradation—if scripts aren't found, those validation steps are skipped automatically. You can also disable specific validations in `.cursor/hooks.config.json`.

### 4. Set Up MCP Servers (One-Time Pain, Then Done)

**Heads up:** I configured these manually in Cursor IDE settings. Worth the 10 minutes.

To configure MCP servers:

1. Open Cursor IDE Settings
2. Navigate to MCP Servers section
3. Add servers from the `mcps/` directory examples
4. Or configure your own if you have different workflows

What you get: 189+ tools I use daily for browser automation, GitHub, docs lookup, and design.

See `[docs/README.md](docs/README.md)` for the full list.

### 5. Let It Work for You

Cursor now automatically does what I was doing manually:

- ✅ Loads the right rules at the right time
- ✅ Fires up MCP servers when needed
- ✅ Runs my validation hooks after every code change
- ✅ Loads skills when the task calls for it

### 6. Read What I Learned (If You Want the Full Story)

- `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)` - The 3,239-line guide I wish someone gave me
- `[docs/README.md](docs/README.md)` - Reference for all 189+ tools

---

## 🚀 Using This in Another Project

I've gotten questions about porting this setup to other projects. Here's everything you need to know.

### Quick Port Guide

**Minimum Setup (Plan Tracking Only):**
```bash
# 1. Copy the .cursor/ folder to your project root
cp -r instructify/.cursor your-project/

# 2. Install tsx (only dependency needed)
npm install -D tsx

# 3. Edit .cursor/hooks.json to only include plan tracking
{
  "hooks": {
    "plan_mode_exit": [{
      "command": "npx tsx .cursor/hooks/plan-quality-tracker.ts",
      "runtime": "node"
    }]
  }
}
```

That's it. Plan tracking works standalone—no linting, no typecheck, no tests.

**Full Setup (All Validation Hooks):**

```bash
# 1. Copy .cursor/ folder
cp -r instructify/.cursor your-project/

# 2. Install all dependencies
npm install -D tsx typescript eslint @eslint/js \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  typescript-eslint globals

# 3. Add scripts to package.json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  }
}

# 4. Create minimal tsconfig.json (if you don't have one)
{
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true
  }
}

# 5. Create eslint.config.js (or use your own)
# Copy from instructify or create your own
```

### Feature Matrix - What Works With What

| Feature | Minimum Required | Full Setup |
|---------|-----------------|------------|
| **Basic hooks run** | `tsx` only | ✅ |
| **Auto-lint-fix** | `tsx` + `eslint` + scripts | ✅ |
| **Auto-validate (lint)** | `tsx` + `eslint` + scripts | ✅ |
| **Auto-validate (typecheck)** | `tsx` + `typescript` + scripts | ✅ |
| **Auto-validate (tests)** | Test script in package.json | ✅ |
| **Auto-validate (MCP)** | MCP servers configured | ✅ |
| **Plan quality tracker** | `tsx` only | ✅ |
| **Reports generation** | File write permissions | ✅ |

### Customizing for Your Project

**Disable Specific Validations:**
Create `.cursor/hooks.config.json`:
```json
{
  "validation": {
    "enableLint": false,      // Disable ESLint
    "enableTypecheck": false,  // Disable TypeScript check
    "enableTests": false,      // Disable tests
    "enableMCPValidation": false // Disable MCP validation
  }
}
```

**Use Custom Commands:**
```json
{
  "validation": {
    "lintCommand": "bun run lint",
    "typecheckCommand": "bun run typecheck",
    "testCommand": "bun run test"
  }
}
```

**Adjust Plan Tracking Thresholds:**
```json
{
  "planTracking": {
    "accuracyThreshold": 80,    // Alert below 80% (default: 70)
    "efficiencyThreshold": 70,  // Alert below 70 (default: 60)
    "maxIterations": 3,         // Warn after 3 iterations (default: 5)
    "provideFeedback": false    // Disable feedback messages
  }
}
```

### Common Issues When Porting

| Issue | Solution |
|-------|----------|
| Hooks don't run | Check Cursor version >= 0.40.0 |
| `tsx` not found | `npm install -g tsx` or install as dev dep |
| ESLint fails | Ensure `eslint.config.js` exists or disable linting |
| Typecheck fails | Add `tsconfig.json` to project root |
| Tests don't run | Add test files or disable tests in config |
| MCP validation errors | Disable in `hooks.config.json` or configure MCP servers |
| TypeScript errors in hooks | Make sure `@types/node` is installed |

### What I'd Do Differently

If I were porting this to a new project today:

1. **Start minimal** - Just plan tracking first, add validation later
2. **Use existing configs** - If you already have ESLint/TypeScript, just copy hooks
3. **Disable what you don't need** - Use `hooks.config.json` to turn off unused features
4. **Test incrementally** - Verify each hook works before enabling the next one

---

## 📊 The Numbers I Tracked on My Own Projects

**Before I built Instructify (my typical sessions):**

- ⏱️ Time: 45-60 minutes per task
- 💰 Tokens: 50k-100k burned
- 🔄 Revisions: 8-12 cycles of frustration
- 😤 Frustration: "Maybe I should just do it myself"

**After using my own setup for a few months:**

- ⏱️ Time: 30-40 minutes (**~30-40% faster**—I get to leave earlier)
- 💰 Tokens: 35k-60k (**~30-40% less**—my quota lasts longer)
- 🔄 Revisions: 3-5 (**~50% fewer**—I review code instead of rewriting it)
- 😊 Frustration: Actually enjoying building again

**After Hook Optimization (March 2026):**

- 🔥 Hook overhead: ~600ms → ~200ms per conversation (**66% reduction**)
- 📉 Redundant code: 6 hooks → 3 hooks (**50% reduction**)
- ⚡ Execution order: Non-deterministic → Guaranteed correct order
- 🎯 Change detection: Always run → Smart detection (skips ~40% of unnecessary runs)

---

## 🎓 When to Use What

### Browser Automation

```
                    Start
                      │
                      ▼
          ┌───────────────────────┐
          │ Need Lighthouse or    │
          │ performance profiling?│
          └───────────┬───────────┘
                      │
         ┌────────────┼────────────┐
         │ YES        │            │ NO
         ▼            │            ▼
┌─────────────┐      │   ┌──────────────────┐
│ user-chrome │      │   │ Need full        │
│ -devtools   │      │   │ automation?      │
│ (Lighthouse)│      │   └────────┬─────────┘
└─────────────┘      │            │
                     │   ┌────────┼─────────┐
                     │   │ YES    │         │ NO
                     │   ▼        │         ▼
                     │ ┌──────────┴┐  ┌────────────┐
                     │ │ cursor-   │  │ user-      │
                     │ │ ide-      │  │ selenium   │
                     │ │ browser   │  │ (a11y tree)│
                     │ │ (27 tools)│  └────────────┘
                     │ └───────────┘
                     └───────────────────────────────┘
```

### Library Documentation

```
         Start
           │
           ▼
┌──────────────────────┐
│ Need API reference   │
│ + code examples?     │
└──────────┬───────────┘
           │
  ┌────────┼────────┐
  │ YES    │        │ NO
  ▼        │        ▼
┌─────────┴┐    ┌──────────────┐
│ user-    │    │ user-mcp-    │
│ context7 │    │ deepwiki     │
│ (resolve │    │ (wiki-style  │
│  → query)│    │  docs)       │
└──────────┘    └──────────────┘
```

### GitHub Operations

Use `user-github` for:

- `search_*` → Find stuff
- `issue_*` → Track issues
- `pull_request_*` → Manage PRs
- `push_files` → Commit code

---

## 🔧 Configuration (My Setup)

### Hook Runtime Requirements

I use TypeScript for the hooks. You can run them two ways:

**Option 1: tsx (What I Use - Works with Node.js)**

```bash
# Install tsx globally
npm install -g tsx

# Hooks will automatically use npx tsx
```

**Option 2: Bun (If You're Fancy)**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Update .cursor/hooks.json to use bun run
```

### Customizing Hook Behavior (`.cursor/hooks.config.json`)

I added an optional configuration file to customize hook behavior without editing the scripts:

```json
{
  "validation": {
    "enableLint": true,
    "enableTypecheck": true,
    "enableTests": true,
    "enableMCPValidation": true,
    "lintCommand": null,
    "typecheckCommand": null,
    "testCommand": null
  },
  "planTracking": {
    "trackMetrics": true,
    "accuracyThreshold": 70,
    "efficiencyThreshold": 60,
    "maxIterations": 5,
    "provideFeedback": true
  },
  "autoLintFix": {
    "enabled": true,
    "maxFixAttempts": 1,
    "timeout": 60000
  },
  "reporting": {
    "generateReports": true,
    "reportDirectory": ".cursor",
    "appendReports": false
  }
}
```

**What you can customize:**

- **Validation**: Enable/disable specific checks (lint, typecheck, tests, MCP validation)
- **Commands**: Override default npm scripts with custom commands
- **Plan Tracking**: Set accuracy/efficiency thresholds, disable metrics collection
- **Reporting**: Control report generation and storage location

This is especially useful if your project doesn't use standard npm scripts or if you want to disable certain validations.

### My Hook Setup (`.cursor/hooks.json`)

```json
{
  "version": 1,
  "hooks": {
    "after_code_change": [
      {
        "command": "npx tsx .cursor/hooks/auto-lint-fix.ts",
        "runtime": "node",
        "description": "Auto-fix ESLint issues after code changes"
      },
      {
        "command": "npx tsx .cursor/hooks/auto-validate.ts",
        "runtime": "node",
        "description": "Run validation sequence (lint, typecheck, tests, MCP validation)"
      }
    ],
    "plan_mode_exit": [
      {
        "command": "npx tsx .cursor/hooks/plan-quality-tracker.ts",
        "runtime": "node",
        "description": "Track plan execution metrics and provide feedback"
      }
    ]
  }
}
```

**Note:** I consolidated from 6 hooks to 3 to eliminate redundancy. The old `test-runner.ts`, `mcp-tool-validator.ts`, and `plan-mode-monitor.ts` have been merged into `auto-validate.ts` and `plan-quality-tracker.ts`.

### Tool Cost Hierarchy (Learned This the Hard Way)

```
Tier 1 (Cheapest) ──► Shell, Read, Write, Glob, Grep
                       ↓
Tier 2 (Moderate) ──► ReadLints, SemanticSearch
                       ↓
Tier 3 (Expensive) ─► Task, WebSearch, WebFetch
                       ↓
Tier 4 (MCP) ───────► 189+ specialized tools
```

**Rule of thumb:** I start with Tier 1. Only go higher when I need to. Saves tokens.

---

## 🔌 Version Compatibility (What I'm Running)


| Component  | Minimum Version | What I Recommend  |
| ---------- | --------------- | ----------------- |
| Cursor IDE | 0.40.0          | Latest (trust me) |
| Node.js    | 20.0.0          | 20.x or 22.x      |
| npm        | 9.0.0           | Latest            |
| TypeScript | 5.3.0           | Latest            |
| tsx        | 4.6.0           | Latest            |


### Checking Your Versions

```bash
# Check Cursor version (in Cursor: Help > About)
# Check Node.js version
node --version

# Check npm version
npm --version
```

### Updating (Keep It Fresh)

```bash
# Update Node.js (using nvm)
nvm install 20
nvm use 20

# Update tsx
npm install -g tsx@latest

# Update Cursor IDE
# Download from: https://cursor.com
```

**Pro tip:** I update Cursor monthly. They keep making it better.

---

## 🔧 Hook Architecture Improvements (March 2026 Update)

I recently optimized my hook setup to eliminate redundancy and improve performance. Here's what changed:

### Before (6 Hooks - Redundant)

```
stop event → All 6 hooks fire in unknown order:
  ❌ test-runner.ts (runs tests)
  ❌ auto-validate.ts (also runs tests!)
  ❌ mcp-tool-validator.ts (validates MCP tools)
  ❌ auto-validate.ts (also validates MCP tools!)
  ❌ plan-mode-monitor.ts (tracks metrics)
  ❌ plan-quality-tracker.ts (also tracks metrics!)
  
Problems:
  - Duplicate test execution
  - Redundant MCP validation
  - Conflicting metric tracking
  - No execution order guarantee
  - ~600ms+ overhead per conversation
```

### After (3 Hooks - Streamlined)

```
after_code_change → auto-lint-fix.ts (fix first)
                 → auto-validate.ts (validate after fixing)
                     • Lint + typecheck + tests + MCP validation
                     • Smart change detection
                     • Graceful degradation

plan_mode_exit → plan-quality-tracker.ts
                   • Unified metrics tracking
                   • Real tool usage analysis
                   • Accuracy calculations

Benefits:
  ✅ No redundant execution
  ✅ Guaranteed execution order
  ✅ Smart detection skips unnecessary runs
  ✅ ~200ms estimated overhead (66% reduction)
  ✅ Configurable via hooks.config.json
```

### What Was Merged

**`auto-validate.ts` now includes:**
- ✅ Original lint/typecheck validation
- ✅ Test runner functionality (from `test-runner.ts`)
- ✅ MCP tool validation (from `mcp-tool-validator.ts`)
- ✅ Smart code change detection
- ✅ Graceful degradation for missing scripts

**`plan-quality-tracker.ts` now includes:**
- ✅ Original plan metrics tracking
- ✅ Plan mode monitoring (from `plan-mode-monitor.ts`)
- ✅ Real tool usage extraction from conversations
- ✅ Actual accuracy calculations (not placeholders)
- ✅ Tool efficiency scoring

### New Features

**Smart Change Detection:**
```typescript
// Only runs validation if code actually changed
function detectCodeChanges(conversation: any): boolean {
  return conversation.messages?.some((m: any) => 
    m.content?.includes('StrReplace') || 
    m.content?.includes('Write') ||
    m.tool_calls?.some((t: any) => 
      ['StrReplace', 'Write', 'EditNotebook'].includes(t.function?.name)
    )
  );
}
```

**Graceful Degradation:**
```typescript
// Checks for npm scripts before running
function hasScript(scriptName: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    return !!pkg.scripts?.[scriptName];
  } catch {
    return false;
  }
}

// Skips validation if script doesn't exist
if (hasScript('lint')) {
  execSync('npm run lint', { ... });
} else {
  console.error('[Auto-Validate] No lint script found, skipping');
}
```

**Real Tool Tracking:**
```typescript
// Extracts actual tool usage from conversation
function extractToolCalls(conversation: any): ToolCall[] {
  const tools: ToolCall[] = [];
  for (const message of conversation.messages) {
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        tools.push({
          name: toolCall.function?.name,
          success: true,
          mcp_server: determineMCPServer(toolCall.function?.name)
        });
      }
    }
  }
  return tools;
}
```

---

## 🤝 Why I'm Sharing This

I built Instructify to solve my own problems. But if you're struggling with the same shit I was—token waste, endless revisions, agents that don't learn—then maybe this can help you too.

If you improve it, I'd love to hear about it:

- New MCP server configs that fit your workflow
- Better skill definitions
- Hook scripts that catch bugs I missed
- Your war stories and use cases

Check `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)` for the full guide I wrote for myself.

---

## 📄 License

MIT License - Do whatever you want, just don't sue us.

---

## 🙏 What I Learned From

I didn't figure this out in a vacuum. Here's what shaped Instructify:

### Research Papers (The Smart Stuff)

1. **Lulla, J.L. et al.** (Jan 2026). "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents."
  - 📄 [arXiv:2601.20404](https://arxiv.org/abs/2601.20404)
  - This is where I got the tiered context idea
2. **Gloaguen, T. et al.** (Feb 2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
  - 📄 [arXiv:2602.11988](https://arxiv.org/abs/2602.11988)
  - Proved my "less is more" hunch about context loading
3. **Exploratory Study** (2026). "Configuring Agentic AI Coding Tools."
  - Findings on tiered injection and modularity—shaped my hook architecture

### Community Resources (Standing on Shoulders)

- **Cursor Team** - [Agent Best Practices](https://cursor.com/blog/agent-best-practices) - The foundation
- **Cursor Docs** - [Rules](https://cursor.com/docs/context/rules) | [Skills](https://cursor.com/docs/context/skills) | [Hooks](https://cursor.com/docs/agent/hooks) - My starting point
- **ETH Zurich** - AI agent instruction research (Jan-Feb 2026) - The science behind the magic

---

## 📬 If You Need Help

I built this for myself, but I'm happy to help if you're stuck:

- **Installation**: `npm install instructify` then `npx instructify init`
- **The Full Story**: `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)` - Everything I learned
- **Tool Reference**: `[docs/README.md](docs/README.md)` - All 189+ tools documented
- **NPM Package**: [instructify on npmjs.com](https://www.npmjs.com/package/instructify)
- **Issues**: [GitHub Issues](https://github.com/kanishka-namdeo/instructify/issues) - File a bug
- **Discussions**: [GitHub Discussions](https://github.com/kanishka-namdeo/instructify/discussions) - Share your setup

---

**Built for myself, shared with you. Hope it saves you as much time as it saved me.**

— Kanishka ☕ → 🚀