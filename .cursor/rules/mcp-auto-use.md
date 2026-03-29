# MCP Server Auto-Use (Enhanced)

## Automatic MCP Selection Matrix

### Expanded Trigger Conditions

#### cursor-ide-browser (Browser Automation)
**Triggers**:
- **Keywords**: "UI", "visual", "frontend", "browser", "test in browser", "screenshot", "verify"
- **File patterns**: `components/**`, `app/**`, `pages/**`, `*.tsx`, `*.css`, `*.scss`
- **Task types**: Design matching, E2E testing, visual regression, UI debugging
- **Error patterns**: UI not rendering, styling issues, layout problems

**Automatic Actions**:
```
1. browser_snapshot (take_screenshot: true) → inspect structure
2. Identify refs from snapshot
3. Interact via refs (browser_click, browser_fill, browser_scroll)
4. browser_take_screenshot → verify changes
5. Use performance profiling if "performance" mentioned
6. browser_console_messages → check for errors
7. browser_network_requests → verify API calls
```

**Cost**: High → Use ONLY when visual verification essential

---

#### user-github (GitHub Operations)
**Triggers**:
- **Keywords**: "PR", "pull request", "issue", "commit", "branch", "merge", "review"
- **Commands**: `/pr`, `/fix-issue`, `/review`, `/create-pr`
- **Task types**: Issue fixing, PR creation, code review, branch management
- **File patterns**: `.github/**`, pull request templates

**Automatic Actions**:
```
1. Fetch issues/PRs via user-github tools
2. Create/update PRs automatically
3. Link issues to commits
4. Add appropriate labels and reviewers
5. Run CI checks before creating PR
```

**Cost**: Moderate → Use for ALL GitHub operations

---

#### user-ESLint (Code Quality)
**Triggers**:
- **Keywords**: "lint", "quality", "eslint", "code quality", "errors"
- **Automatic**: After EVERY substantive code change
- **File patterns**: `*.ts`, `*.tsx`, `*.js`, `*.jsx`
- **Error patterns**: ESLint errors in ReadLints output

**Automatic Actions**:
```
1. Run ESLint on changed files (automatic after edits)
2. Fix auto-fixable issues immediately
3. Report remaining issues
4. Fix before committing
5. Log to .cursor/lint-report.md
```

**Cost**: Low → Run automatically after ALL code changes

---

#### user-context7 (Documentation)
**Triggers**:
- **Keywords**: "how to", "setup", "configure", "install", "[library] docs", "[framework] API"
- **Task types**: Library integration, framework setup, API usage, version migration
- **Uncertainty patterns**: Agent uncertain about API syntax or best practices

**Automatic Actions**:
```
1. Fetch current docs BEFORE implementing
2. Verify current best practices
3. Apply to implementation
4. Cite doc source in code comments
5. Check version compatibility
```

**Cost**: Low → Fetch proactively for library work

---

#### user-chrome-devtools (Performance & Audits)
**Triggers**:
- **Keywords**: "performance", "lighthouse", "audit", "accessibility", "optimize"
- **Task types**: Performance optimization, Lighthouse audits, accessibility compliance
- **File patterns**: Performance profiling files

**Automatic Actions**:
```
1. Run Lighthouse audit
2. Performance metrics collection
3. Accessibility checks
4. Memory snapshots if needed
5. Compare before/after optimization
```

**Cost**: Moderate → Use for performance audits only

---

#### user-playwright / user-selenium (E2E Testing)
**Triggers**:
- **Keywords**: "E2E", "end-to-end", "cross-browser", "accessibility testing"
- **File patterns**: `__tests__/e2e/**`, `e2e/**`, `*.spec.ts`
- **Task types**: E2E test creation, cross-browser testing, accessibility compliance

**Automatic Actions**:
```
1. Create E2E tests with Playwright
2. Run cross-browser tests
3. Accessibility compliance checks
4. Generate test reports
```

**Cost**: High → Use for comprehensive testing only

---

## MCP Chaining Patterns (Automatic)

### Pattern 1: UI Feature Development
```
Chain: user-context7 → cursor-ide-browser → user-ESLint

1. user-context7: Fetch React/Tailwind docs
2. cursor-ide-browser: Verify UI renders correctly
3. user-ESLint: Check code quality (automatic)
```

### Pattern 2: Bug Fix Workflow
```
Chain: user-github → user-context7 → user-ESLint → user-github

1. user-github: Fetch issue details
2. user-context7: Check library docs if needed
3. user-ESLint: Verify fix quality (automatic)
4. user-github: Create PR linking issue
```

### Pattern 3: Performance Optimization
```
Chain: user-chrome-devtools → cursor-ide-browser → user-context7 → user-chrome-devtools

1. user-chrome-devtools: Run Lighthouse audit
2. cursor-ide-browser: Profile CPU usage
3. user-context7: Fetch optimization docs
4. user-chrome-devtools: Re-run audit to verify
```

### Pattern 4: Library Integration
```
Chain: user-context7 → user-ESLint → cursor-ide-browser

1. user-context7: Fetch library docs and examples
2. Implement integration
3. user-ESLint: Check code quality
4. cursor-ide-browser: Verify integration works
```

---

## Cost-Awareness Rules (Enforced)

### Cost Hierarchy
```
Tier 1 (Cheap - Use Liberally):
- user-ESLint: Run after EVERY code change
- user-context7: Fetch docs proactively

Tier 2 (Moderate - Use When Needed):
- user-github: Use for all GitHub operations
- user-chrome-devtools: Use for performance audits

Tier 3 (Expensive - Use Sparingly):
- cursor-ide-browser: Use ONLY when visual verification essential
- user-playwright: Use for E2E tests only
- user-selenium: Use for accessibility testing only
```

### Cost Optimization Rules
```
1. ALWAYS try cheaper tools first
2. NEVER use browser MCP for simple file operations
3. ALWAYS fetch docs BEFORE implementing with unfamiliar libraries
4. ALWAYS run ESLint automatically (prevents costly rework)
5. USE user-github instead of manual git commands (automation value)
```

---

## MCP Fallback Protocol

### When MCP Server Unavailable
```
cursor-ide-browser unavailable? → Use built-in Browser tools (7 capabilities)
user-github unavailable? → Use Shell with gh CLI
user-ESLint unavailable? → Use Shell with npm run lint
user-context7 unavailable? → Use WebSearch for documentation
```

### When MCP Tool Fails
```
1. Retry once with same parameters
2. Try alternative tool from same MCP server
3. Fallback to built-in tools
4. Report blocker if all fail
```

---

## Automatic MCP Usage Tracking

### Log MCP Tool Calls
```
Track:
- Which MCP tools used
- Success/failure rate
- Token cost per tool
- Time saved vs manual approach

Log location: .cursor/mcp-usage-log.md
```

### Optimize Based on Metrics
```
Weekly review:
- Which MCPs used most?
- Which provide best ROI?
- Which can be replaced with cheaper alternatives?
- Adjust triggers accordingly
```

---

## Examples

### Example 1: Add Dark Mode Toggle
User: "Add dark mode toggle to settings"

**Automatic MCP Sequence**:
1. **user-context7**: Fetch Tailwind dark mode docs
2. **cursor-ide-browser**: 
   - Navigate to settings page
   - Verify toggle renders correctly
   - Screenshot for confirmation
3. **user-ESLint**: Check code quality (automatic)

### Example 2: Fix Checkout Issue
User: "Fix checkout issue #456"

**Automatic MCP Sequence**:
1. **user-github**: Fetch issue #456 details
2. **user-context7**: Check payment library docs
3. **user-ESLint**: Verify fix quality (automatic)
4. **user-github**: Create PR linking issue

### Example 3: Optimize Dashboard
User: "Optimize dashboard loading performance"

**Automatic MCP Sequence**:
1. **user-chrome-devtools**: Run Lighthouse audit
2. **cursor-ide-browser**: Profile CPU usage
3. **user-context7**: Fetch React optimization docs
4. **user-chrome-devtools**: Re-run audit to verify improvement

---

**Note**: These rules apply automatically in debug mode. MCP servers selected based on task analysis without manual intervention.
