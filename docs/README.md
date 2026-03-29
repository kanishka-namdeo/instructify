# Instructify Documentation

Welcome to the Instructify documentation! This is your comprehensive guide to optimizing AI coding agent workflows in Cursor IDE.

## 📚 What You'll Find Here

This documentation covers everything from basic setup to advanced MCP server configurations and hook automation.

## 🚀 Quick Start

### Installing the Package

```bash
# Install from npm
npm install instructify

# Initialize in your project
npx instructify init

# Verify Cursor compatibility
npx instructify verify
```

### Minimum Requirements

- **Cursor IDE**: >= 0.40.0 ([Download](https://cursor.com))
- **Node.js**: >= 20.0.0
- **npm**: >= 9.0.0

### For Full Hook Functionality

```bash
# Install hook dependencies
npm install -D tsx typescript eslint @eslint/js \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  typescript-eslint globals
```

## 📖 Documentation Sections

### Getting Started

- **[INSTALLATION.md](INSTALLATION.md)** - Complete installation guide for all scenarios
- **[README.md](../README.md)** - Main documentation with setup guide and workflow examples
- **[NPM-PUBLISH.md](NPM-PUBLISH.md)** - Guide for publishing to npm (maintainers)

### Core Concepts

- **[AGENT-INSTRUCTION-BEST-PRACTICES.md](../AGENT-INSTRUCTION-BEST-PRACTICES.md)** - Comprehensive 3,239-line guide on AI agent instruction
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and recent changes
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - How to contribute to the project

### Using in Other Projects

See the **"🚀 Using This in Another Project"** section in the main README for:
- Quick port guide (minimal vs full setup)
- Feature matrix (what works with what)
- Customization examples
- Common issues and solutions

## 🔧 Configuration Files

### Hook Configuration (`.cursor/hooks.json`)

Defines which hooks run on which events:

```json
{
  "version": 1,
  "hooks": {
    "after_code_change": [
      {
        "command": "npx tsx .cursor/hooks/auto-lint-fix.ts",
        "runtime": "node",
        "description": "Auto-fix ESLint issues"
      },
      {
        "command": "npx tsx .cursor/hooks/auto-validate.ts",
        "runtime": "node",
        "description": "Run validation sequence"
      }
    ],
    "plan_mode_exit": [
      {
        "command": "npx tsx .cursor/hooks/plan-quality-tracker.ts",
        "runtime": "node",
        "description": "Track plan metrics"
      }
    ]
  }
}
```

### Custom Settings (`.cursor/hooks.config.json`)

Optional configuration for customizing hook behavior:

```json
{
  "validation": {
    "enableLint": true,
    "enableTypecheck": true,
    "enableTests": true,
    "enableMCPValidation": true
  },
  "planTracking": {
    "trackMetrics": true,
    "accuracyThreshold": 70,
    "efficiencyThreshold": 60,
    "maxIterations": 5,
    "provideFeedback": true
  }
}
```

## 🎯 Key Features

### 1. Tiered Context System

Reduces token waste by loading context intelligently:

```
Always Loaded ──────► general.md (15 lines)
                       ↓
Task Triggers ──────► Tier 1 (high-priority rules)
                       ↓
Complex Tasks ──────► Tier 2 (specialized capabilities)
```

**Result:** ~30-40% reduction in token consumption

### 2. Automated Validation Hooks

Three streamlined hooks that run automatically:

- **auto-lint-fix.ts** - Fixes ESLint issues after code changes
- **auto-validate.ts** - Unified validation (lint + typecheck + tests + MCP)
- **plan-quality-tracker.ts** - Tracks metrics and provides feedback

**Result:** ~66% reduction in hook overhead (600ms → 200ms)

### 3. MCP Server Integrations

189+ specialized tools across 12 MCP servers:

#### Browser Automation
- `cursor-ide-browser` - 27 tools (automation + profiling)
- `user-chrome-devtools` - 30 tools (Lighthouse scores)
- `user-playwright` - 22 tools (E2E tests)
- `user-selenium` - 18 tools + accessibility tree

#### Development Tools
- `user-github` - 42 tools (PRs, issues, search)
- `user-dart` - 26 tools (Flutter lifecycle, testing)
- `user-ESLint` - Code quality checks

#### Documentation & Design
- `user-context7` - Library docs lookup
- `user-mcp-deepwiki` - Deep wiki searches
- `user-stitch` - 12 UI design tools
- `user-shadcn` - 7 shadcn component tools

#### Reasoning
- `user-sequential-thinking` - Complex problem solving

### 4. Dynamic Skills

11 on-demand capabilities:

- Debug optimization
- MCP server mastery
- Parallel exploration patterns
- Tool selection strategies
- Framework guides (React, Next.js, Vite, Tauri, Electron, Python)
- Plan mode optimization

## 📊 Performance Metrics

Based on real workflow tracking:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Task completion time | 45-60 min | 30-40 min | ~30-40% faster |
| Token consumption | 50k-100k | 35k-60k | ~30-40% less |
| Revision cycles | 8-12 | 3-5 | ~50% fewer |
| Hook overhead | ~600ms | ~200ms | 66% reduction |

## 🛠️ Tool Cost Hierarchy

Use this guide to minimize token usage:

```
Tier 1 (Cheapest) ──► Shell, Read, Write, Glob, Grep
                        ↓
Tier 2 (Moderate) ──► ReadLints, SemanticSearch
                        ↓
Tier 3 (Expensive) ─► Task, WebSearch, WebFetch
                        ↓
Tier 4 (MCP) ───────► 189+ specialized tools
```

**Rule:** Start with Tier 1. Only go higher when needed.

## 🔌 MCP Server Setup

### Configuring MCP Servers

1. Open Cursor IDE Settings
2. Navigate to MCP Servers section
3. Add servers from examples or configure your own
4. Test tools to verify they work

### Available MCP Servers

See individual server configurations in the `mcps/` directory (if installed from git) or refer to the main README for the complete list.

## 📝 Rules System

Context rules for intelligent task-specific loading:

- **general.md** - Essential guidelines (always loaded)
- **context-tier-1.md** - High-priority task-specific rules
- **context-tier-2.md** - Specialized capabilities
- **mcp-auto-use.md** - When to activate MCP servers
- **tool-strategy.md** - Tool cost hierarchy
- **plan-mode-*.md** - Plan mode validation and execution

## 🎓 Learning Resources

### Research-Backed Strategies

This project integrates findings from:

1. **Lulla, J.L. et al.** (Jan 2026). "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents."
   - [arXiv:2601.20404](https://arxiv.org/abs/2601.20404)

2. **Gloaguen, T. et al.** (Feb 2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
   - [arXiv:2602.11988](https://arxiv.org/abs/2602.11988)

3. **ETH Zurich** - AI agent instruction research on tiered injection and modularity

### Community Resources

- [Cursor Agent Best Practices](https://cursor.com/blog/agent-best-practices)
- [Cursor Rules Documentation](https://cursor.com/docs/context/rules)
- [Cursor Skills Documentation](https://cursor.com/docs/context/skills)
- [Cursor Hooks Documentation](https://cursor.com/docs/agent/hooks)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Adding new rules
- Creating new skills
- Adding MCP server configurations
- Writing hook scripts
- Improving documentation

### Quick Contribution Guide

```bash
# 1. Fork the repository
git clone https://github.com/your-username/instructify.git

# 2. Create a branch
git checkout -b feature/your-feature

# 3. Make changes and test in Cursor IDE

# 4. Submit a pull request
```

## 📦 Package Information

- **Version**: 1.0.0
- **License**: MIT
- **Size**: ~99.9 kB
- **Repository**: [github.com/kanishka-namdeo/instructify](https://github.com/kanishka-namdeo/instructify)
- **NPM**: [npmjs.com/package/instructify](https://www.npmjs.com/package/instructify)

## 🙋 Getting Help

- **Documentation**: Start with the main README
- **Issues**: [GitHub Issues](https://github.com/kanishka-namdeo/instructify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kanishka-namdeo/instructify/discussions)

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details.

---

**Built for myself, shared with you. Hope it saves you as much time as it saved me.**

— Kanishka ☕ → 🚀
