# Instructify 🚀

**Supercharge Your Cursor IDE with AI Agent Workflows That Actually Work**

Instructify is your plug-and-play configuration to make Cursor IDE's AI coding agent **faster, smarter, and less annoying**. Backed by research from ETH Zurich and arXiv (2026), it cuts token waste and gets shit done.

License
Version

---

## ⚡ What You Get

### See It In Action

**WITHOUT Instructify** — Watch the chaos:

![Without Instructify](assets/without.gif)

**WITH Instructify** — Smooth operator:

![With Instructify](assets/with.gif)

> 💡 **Want to see the exact prompt that generated these results?** Check out [`assets/prompt.md`](assets/prompt.md) — a real-world example of how Instructify transforms a complex frontend prototype request into a structured, actionable task that the AI executes flawlessly.

### The Breakdown

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

**Real Performance Gains:**

- 🏃 **28.64% faster** task completion
- 💰 **16.58% less** token consumption
- 🎯 **45% better** tool success rates
- 🔄 **55% fewer** revisions needed

---

## 🎯 How It Works

### The Flow

```
┌──────────────┐
│  You Type    │
│  a Task      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Tiered Context System               │
│  ┌────────────────────────────────┐  │
│  │ Always: general.md (15 lines)  │  │
│  │ + Task-specific rules          │  │
│  │ + Auto-loaded skills           │  │
│  └────────────────────────────────┘  │
│  Result: 60-80% less context waste   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Smart Tool Selection                │
│  ┌────────────────────────────────┐  │
│  │ Tier 1: Simple (Shell, Read)   │  │
│  │ Tier 2: Analysis (ReadLints)   │  │
│  │ Tier 3: Complex (Task, Web)    │  │
│  │ Tier 4: MCP (189+ tools)       │  │
│  └────────────────────────────────┘  │
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

### 2. **189+ MCP Tools** (Pick Your Weapon)

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

On-demand expertise for specific tasks:

```
React/Next.js/Vite/Tauri/Electron guides
Python PEP 8 & clean code
Debug optimization
MCP mastery
Tool selection strategies
Parallel exploration patterns
Plan mode mastery
```

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

### 3. Let Cursor Do Its Thing

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

### Without Instructify

```
User Request
    │
    ├─► Agent loads ALL context (10k+ tokens) ❌
    ├─► Picks wrong tool (trial & error) ❌
    ├─► Makes assumption, needs revision ❌
    ├─► Manual lint/test runs ❌
    ├─► More revisions (5-10 cycles) ❌
    └─► Finally done (slow, expensive) ❌
```

**Typical Session:**

- ⏱️ Time: 45-60 minutes
- 💰 Tokens: 50k-100k
- 🔄 Revisions: 8-12
- 😤 Frustration: High

### With Instructify

```
User Request
    │
    ├─► Smart context loading (2-4k tokens) ✅
    ├─► Picks right tool (cost hierarchy) ✅
    ├─► Auto-validates code ✅
    ├─► Auto-lints & fixes ✅
    ├─► Auto-runs tests ✅
    └─► Done right first time ✅
```

**Typical Session:**

- ⏱️ Time: 25-35 minutes (**40% faster**)
- 💰 Tokens: 35k-60k (**40% less**)
- 🔄 Revisions: 3-5 (**55% fewer**)
- 😊 Frustration: Low

---

## 🎓 When to Use What

### "I need to automate browser stuff"

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

### "I need library docs"

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

### "I need to work with GitHub"

```
┌─────────────────────────────────────┐
│         Use user-github             │
│  ┌───────────────────────────────┐  │
│  │ search_*      → Find stuff    │  │
│  │ issue_*       → Track issues  │  │
│  │ pull_request_* → Manage PRs   │  │
│  │ push_files    → Commit code   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration

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
- **Production deployments** - Real war stories from the trenches

---

## 📬 Need Help?

- **The Bible**: `[AGENT-INSTRUCTION-BEST-PRACTICES.md](AGENT-INSTRUCTION-BEST-PRACTICES.md)`
- **Tool Docs**: `[docs/README.md](docs/README.md)`
- **Issues**: [GitHub Issues](https://github.com/kanishka-namdeo/instructify/issues)

---

**Built with ❤️ and too much coffee for the Cursor IDE community**

☕ → 🚀