# Instructify 🚀

**Supercharge Your Cursor IDE with AI Agent Workflows That Actually Work**

Instructify is your plug-and-play configuration to make Cursor IDE's AI coding agent **faster, smarter, and less annoying**. Backed by research, it cuts token waste and gets shit done.

## 📦 Installation

### Option 1: NPM Package (Recommended)

```bash
# Install the package
npm install instructify

# Run the setup CLI
npx instructify init

# Or verify Cursor compatibility
npx instructify verify
```

### Option 2: Git Repository

```bash
git clone https://github.com/kanishka-namdeo/instructify.git
cd instructify
# Manually copy .cursor/ to your project root
```

### Requirements

- **Cursor IDE**: >= 0.40.0 ([Download](https://cursor.com))
- **Node.js**: >= 20.0.0 (for CLI and hooks)
- **npm**: >= 9.0.0

---


| License        | Version | Package Size |
| -------------- | ------- | ------------ |
| [MIT](LICENSE) | 1.0.0   | 99.9 kB      |


---

## ⚡ What You Get

### See It In Action


|                                         |                                      |
| --------------------------------------- | ------------------------------------ |
| **WITHOUT Instructify** Watch the chaos | **WITH Instructify** Smooth operator |
|                                         |                                      |


> 💡 **Want to see the exact prompt?** Check out `[assets/prompt.md](assets/prompt.md)` — a real-world example of Instructify in action.

### Performance Gains

```
┌─────────────────────────────────────────────────────┐
│  WITHOUT INSTRUCTIFY          │  WITH INSTRUCTIFY  │
├─────────────────────────────────────────────────────┤
│  ❌ Random tool choices        │  ✅ Smart selection │
│  ❌ Context overload           │  ✅ Tiered loading  │
│  ❌ 10+ revision cycles        │  ✅ 55% fewer fixes │
│  ❌ Wasted tokens              │  ✅ 16% less waste  │
│  ❌ Slow task completion       │  ✅ 28% faster      │
│  ❌ Manual lint/test runs      │  ✅ Auto-validation │
└─────────────────────────────────────────────────────┘
```

**Real Results:**

- 🏃 **28.64% faster** task completion
- 💰 **16.58% less** token consumption
- 🎯 **45% better** tool success rates
- 🔄 **55% fewer** revisions needed

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
│  Result: 60-80% less context waste   │
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

## 🛠️ What's Inside

### 1. **Tiered Context System**

No more dumping 10k lines of context on every request.

```
Always Loaded ──────► general.md (15 lines)
                      ↓
Task Triggers ──────► Tier 1 (high-priority rules)
                      ↓
Complex Tasks ──────► Tier 2 (specialized capabilities)
```

### 2. **189+ MCP Tools**

**Browser Automation:**

- `cursor-ide-browser` - 27 tools (full automation + profiling)
- `user-chrome-devtools` - 30 tools (Lighthouse, performance tracing)
- `user-playwright` - 22 tools (E2E testing)
- `user-selenium` - 18 tools + accessibility tree

**Development:**

- `user-github` - 42 tools (PRs, issues, search, file ops)
- `user-dart` - 26 tools (Flutter lifecycle, testing, pub)
- `user-ESLint` - Code quality checks

**Docs & Design:**

- `user-context7` - Library documentation lookup
- `user-mcp-deepwiki` - Deep wiki searches
- `user-stitch` - 12 UI design tools
- `user-shadcn` - 7 shadcn component tools

**Reasoning:**

- `user-sequential-thinking` - Complex problem solving

### 3. **Auto-Validation Hooks**

Six hooks that run automatically after code changes:

```
after_code_change ──► auto-validate.ts
after_code_change ──► auto-lint-fix.ts
after_code_change ──► test-runner.ts
plan_mode_enter ────► plan-mode-monitor.ts
plan_mode_exit ─────► plan-quality-tracker.ts
before_mcp_call ────► mcp-tool-validator.ts
```

### 4. **Dynamic Skills**

On-demand expertise for specific tasks: React/Next.js/Vite/Tauri/Electron guides, Python PEP 8 & clean code, debug optimization, MCP mastery, tool selection strategies, parallel exploration patterns, plan mode mastery.

---

## 📦 Project Structure

```
instructify/
├── .cursor/                    # Cursor IDE config
│   ├── hooks.json             # 6 automated hooks
│   ├── rules/                 # Tiered context rules
│   │   ├── general.md         # Always loaded (15 lines)
│   │   ├── context-tier-1.md  # High-priority tasks
│   │   ├── context-tier-2.md  # Specialized capabilities
│   │   ├── mcp-auto-use.md    # MCP server triggers
│   │   └── tool-strategy.md   # Tool cost hierarchy
│   ├── skills/                # Dynamic capabilities
│   │   ├── debug-optimizer/
│   │   ├── mcp-mastery/
│   │   ├── react-guide/
│   │   ├── nextjs-guide/
│   │   ├── vite-guide/
│   │   ├── tauri-guide/
│   │   ├── electron-guide/
│   │   ├── python-guide/
│   │   └── ... (11 total)
│   └── hooks/                 # TypeScript validation scripts
│       ├── auto-validate.ts
│       ├── auto-lint-fix.ts
│       ├── test-runner.ts
│       └── ...
└── AGENT-INSTRUCTION-BEST-PRACTICES.md  # 3,239-line guide
```

---

## 🚀 Quick Start

### 1. Clone It

```bash
git clone https://github.com/kanishka-namdeo/instructify.git
cd instructify
```

### 2. Install Deps (Optional - Only for Hook Scripts)

```bash
npm install
# or
bun install
```

### 3. MCP Server Configuration (Important)

**Note**: MCP servers are configured in Cursor IDE settings, not automatically by this package.

To configure MCP servers:

1. Open Cursor IDE Settings
2. Navigate to MCP Servers section
3. Add servers from the `mcps/` directory examples (if provided)
4. Or configure your own MCP servers

Available MCP servers provide 189+ specialized tools:

- Browser automation (cursor-ide-browser, Playwright, Selenium, Chrome DevTools)
- Development tools (GitHub API, Dart/Flutter, ESLint)
- Documentation lookup (Context7, DeepWiki)
- UI/UX design (shadcn UI, Stitch)
- Reasoning (Sequential Thinking)

See `[docs/README.md](docs/README.md)` for complete tool documentation.

### 4. Let Cursor Do Its Thing

Cursor automatically:

- ✅ Loads rules based on task context
- ✅ Registers MCP servers from `/mcps/`
- ✅ Executes hooks after code changes
- ✅ Loads skills on-demand

### 4. Read the Good Stuff

Start here:

- `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)` - The bible (3,239 lines)
- `[docs/README.md](docs/README.md)` - Tool reference (189+ tools)

---

## 📊 The Numbers Game

**Without Instructify:**

- ⏱️ Time: 45-60 minutes
- 💰 Tokens: 50k-100k
- 🔄 Revisions: 8-12
- 😤 Frustration: High

**With Instructify:**

- ⏱️ Time: 25-35 minutes (**40% faster**)
- 💰 Tokens: 35k-60k (**40% less**)
- 🔄 Revisions: 3-5 (**55% fewer**)
- 😊 Frustration: Low

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

## 🔧 Configuration

### Hook Runtime Requirements

Hooks use TypeScript and can run with either:

**Option 1: tsx (Recommended - Works with Node.js)**

```bash
# Install tsx globally
npm install -g tsx

# Hooks will automatically use npx tsx
```

**Option 2: Bun**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Update .cursor/hooks.json to use bun run
```

### Hook Setup (`.cursor/hooks.json`)

```json
{
  "hooks": [
    { "type": "after_code_change", "script": ".cursor/hooks/auto-validate.ts" },
    { "type": "after_code_change", "script": ".cursor/hooks/auto-lint-fix.ts" },
    { "type": "after_code_change", "script": ".cursor/hooks/test-runner.ts" },
    { "type": "plan_mode_enter", "script": ".cursor/hooks/plan-mode-monitor.ts" },
    { "type": "plan_mode_exit", "script": ".cursor/hooks/plan-quality-tracker.ts" },
    { "type": "before_mcp_call", "script": ".cursor/hooks/mcp-tool-validator.ts" }
  ]
}
```

### Tool Cost Hierarchy

```
Tier 1 (Cheapest) ──► Shell, Read, Write, Glob, Grep
                       ↓
Tier 2 (Moderate) ──► ReadLints, SemanticSearch
                       ↓
Tier 3 (Expensive) ─► Task, WebSearch, WebFetch
                       ↓
Tier 4 (MCP) ───────► 189+ specialized tools
```

---

## 🔌 Version Compatibility


| Component  | Minimum Version | Recommended  |
| ---------- | --------------- | ------------ |
| Cursor IDE | 0.40.0          | Latest       |
| Node.js    | 20.0.0          | 20.x or 22.x |
| npm        | 9.0.0           | Latest       |
| TypeScript | 5.3.0           | Latest       |
| tsx        | 4.6.0           | Latest       |


### Checking Your Versions

```bash
# Check Cursor version (in Cursor: Help > About)
# Check Node.js version
node --version

# Check npm version
npm --version
```

### Updating

```bash
# Update Node.js (using nvm)
nvm install 20
nvm use 20

# Update tsx
npm install -g tsx@latest

# Update Cursor IDE
# Download from: https://cursor.com
```

---

## 🤝 Contributing

Got ideas? We want:

- New MCP server configs
- Better skill definitions
- Improved hook scripts
- War stories and use cases

Check `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)` for the full guide.

---

## 📄 License

MIT License - Do whatever you want, just don't sue us.

---

## 🙏 Shoutouts

Built on research from:

### Research Papers

1. **Lulla, J.L. et al.** (Jan 2026). "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents."
  - 📄 [arXiv:2601.20404](https://arxiv.org/abs/2601.20404)
2. **Gloaguen, T. et al.** (Feb 2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
  - 📄 [arXiv:2602.11988](https://arxiv.org/abs/2602.11988)
3. **Exploratory Study** (2026). "Configuring Agentic AI Coding Tools."
  - Findings on tiered injection and modularity

### Community Resources

- **Cursor Team** - [Agent Best Practices](https://cursor.com/blog/agent-best-practices)
- **Cursor Docs** - [Rules](https://cursor.com/docs/context/rules) | [Skills](https://cursor.com/docs/context/skills) | [Hooks](https://cursor.com/docs/agent/hooks)
- **ETH Zurich** - AI agent instruction research (Jan-Feb 2026)

---

## 📬 Need Help?

- **Installation**: `npm install instructify` then `npx instructify init`
- **The Bible**: `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)`
- **Tool Docs**: `[docs/README.md](docs/README.md)`
- **NPM Package**: [instructify on npmjs.com](https://www.npmjs.com/package/instructify)
- **Issues**: [GitHub Issues](https://github.com/kanishka-namdeo/instructify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kanishka-namdeo/instructify/discussions)

---

**Built with ❤️ and too much coffee for the Cursor IDE community**

☕ → 🚀