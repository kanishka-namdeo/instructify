# Tool Auto-Selection

## Automatic Tool Selection Rules

### Tool Cost Hierarchy (Start Cheap, Escalate as Needed)

**Tier 1 (Cheapest, Always Try First)**:
- `Read` - Know exact file path
- `Glob` - Pattern-based file finding
- `Grep` - Exact text/symbol search

**Tier 2 (Low-Moderate Cost)**:
- `SemanticSearch` - Conceptual/behavioral search
- `StrReplace` - Targeted edits (<50 lines)
- `Write` - New files or complete rewrites

**Tier 3 (Moderate-High Cost)**:
- `Task` (explore subagent) - Complex exploration
- `Shell` - Command execution and tests
- `ReadLints` - Code quality validation

**Tier 4 (Most Expensive, Last Resort)**:
- Multiple parallel subagents
- Browser MCP automation
- Complex multi-tool workflows

---

## Automatic Triggers

### After Code Changes (AUTOMATIC)
```
After StrReplace or Write → ReadLints on modified files
After ReadLints with errors → Fix immediately with StrReplace
After substantive changes → Shell (run relevant tests)
```

### For Exploration (AUTOMATIC)
```
Know file path? → Read (Tier 1)
Need files by pattern? → Glob + Read (Tier 1)
Exact text search? → Grep (Tier 1)
Conceptual search? → SemanticSearch (Tier 2)
Broad exploration (>3 files)? → Task with explore subagent (Tier 3)
```

### For Implementation (AUTOMATIC)
```
New file? → Write (Tier 2)
Small edit (<50 lines)? → StrReplace (Tier 2)
Large rewrite (>50 lines)? → Write (Tier 2)
Jupyter notebook? → EditNotebook (Tier 2)
```

### For Validation (AUTOMATIC)
```
After ANY code change → ReadLints (Tier 3)
Tests exist for changed code? → Shell (run tests) (Tier 3)
Visual/UI changes? → Browser MCP for verification (Tier 4)
Ambiguous requirements? → AskQuestion (batch questions) (Tier 3)
```

### For Complex Tasks (AUTOMATIC)
```
Task mentions >3 different areas? → Launch 4 parallel subagents (Tier 4)
Task complexity >10 steps? → Launch 3 parallel subagents (Tier 4)
Bug investigation (unknown cause)? → Launch 4 parallel subagents (Tier 4)
Large refactor (>5 files)? → Launch 4 parallel subagents (Tier 4)
```

---

## Decision Trees (Automatic Application)

### "I need to find code"
```
1. Know file path? → Read
2. Pattern matching? → Glob + Read
3. Exact text? → Grep
4. Concept/behavior? → SemanticSearch
5. Broad exploration? → Task (explore)
```

### "I need to modify code"
```
1. Jupyter notebook? → EditNotebook
2. New file? → Write
3. <50 lines change? → StrReplace
4. >50 lines change? → Write (entire file)
```

### "I need to verify"
```
1. Linting issues? → ReadLints (automatic after edits)
2. Tests needed? → Shell (run tests)
3. Visual changes? → Browser/Screenshot
4. User approval? → AskQuestion
```

### "I need to automate browser"
```
1. Performance profiling? → cursor-ide-browser
2. Lighthouse audits? → user-chrome-devtools
3. Cross-browser testing? → user-playwright
4. Quick testing? → Built-in Browser
5. Accessibility? → user-selenium
```

---

## Tool Escalation Protocol

**Rule**: Start with Tier 1, escalate one level at a time only if needed

```
Step 1: Try Tier 1 (Read, Glob, Grep)
  ↓ If insufficient
Step 2: Escalate to Tier 2 (SemanticSearch, StrReplace, Write)
  ↓ If insufficient
Step 3: Escalate to Tier 3 (Task, Shell, ReadLints)
  ↓ If insufficient
Step 4: Escalate to Tier 4 (Parallel subagents, Browser MCP)
```

**Never skip tiers unless explicitly justified**

---

## Automatic Validation Gates

### After EVERY Code Change
1. **ReadLints** on modified files (automatic)
2. **Fix** introduced lints immediately (automatic)
3. **Run tests** if they exist for changed code (automatic)
4. **Update TodoWrite** if tracking progress (automatic)

### Before EVERY Commit
1. **Full test suite** via Shell
2. **Full lint run** via Shell or user-ESLint
3. **Typecheck** via Shell
4. **Checkpoint** if breaking change (via Checkpoints feature)

### After MCP Tool Use
1. **Verify results** (check output validity)
2. **Retry** if failed (max 2 retries)
3. **Fallback** to alternative tool if still failing
4. **Log** effectiveness for future optimization

---

## MCP Server Auto-Selection

### Automatic Triggers
```
File pattern: components/**, app/**, pages/** → cursor-ide-browser
File pattern: __tests__/**, e2e/** → user-playwright
Keywords: "PR", "issue", "branch", "commit" → user-github
Keywords: "lint", "quality", "eslint" → user-ESLint
Keywords: "how to", "setup", "configure", "[library] docs" → user-context7
Keywords: "performance", "lighthouse", "audit" → user-chrome-devtools
Error: ESLint errors detected → user-ESLint (auto-fix mode)
```

### Cost-Awareness Rules
```
user-ESLint: Cheap → Run automatically after ALL code changes
user-context7: Cheap → Fetch docs proactively before library implementation
user-github: Moderate → Use for all GitHub operations
cursor-ide-browser: Expensive → Use ONLY when visual verification essential
user-chrome-devtools: Moderate → Use for performance audits only
```

---

## Tool Combination Patterns

### Pattern 1: Feature Implementation (Automatic Sequence)
```
1. SemanticSearch → Find existing patterns
2. Read → Study canonical examples
3. Write → Create new files
4. Shell → Run tests
5. ReadLints → Verify quality
```

### Pattern 2: Bug Fix (Automatic Sequence)
```
1. Grep → Find related code
2. Read → Understand issue
3. StrReplace → Fix code
4. ReadLints → Check for errors
5. Shell → Run tests
```

### Pattern 3: Refactor (Automatic Sequence)
```
1. Task (explore) → Map all usages
2. Checkpoint → Before breaking changes
3. StrReplace → Incremental changes
4. Shell → Run tests after each change
5. ReadLints → Verify quality
```

### Pattern 4: Code Review (Automatic Sequence)
```
1. Glob → Find changed files
2. Read → Review diffs
3. ReadLints → Check for issues
4. Shell → Run tests
5. AskQuestion → Clarify if needed
```

---

## Error Recovery Patterns

### Tool Failure Recovery
```
Tool fails once? → Retry with same parameters (max 2 retries)
Tool fails twice? → Try alternative tool from same tier
Alternative fails? → Escalate to next tier
Still failing? → Report blocker with details
```

### MCP Server Unavailable
```
MCP server down? → Fallback to built-in tools
Example: user-github unavailable → Use Shell with gh CLI
Example: cursor-ide-browser unavailable → Use built-in Browser tools
```

---

## Anti-Patterns to Avoid

### ❌ Tool Hoarding
**Bad**: Using 5 different tools to read a file  
**Good**: Just use Read

### ❌ Hammer Looking for Nail
**Bad**: Using browser automation for API testing  
**Good**: Using appropriate tool for each task

### ❌ Premature Optimization
**Bad**: Setting up subagents for simple file read  
**Good**: Start simple, escalate when needed

### ❌ Skipping Validation
**Bad**: Edit without ReadLints  
**Good**: Always validate after substantive changes

### ❌ No Checkpoints for Risky Changes
**Bad**: Refactor without rollback point  
**Good**: Checkpoint before breaking changes

---

## Examples

### Example 1: Add API Endpoint (Automatic Tool Selection)
User: "Add /api/products endpoint"

Agent automatically selects:
1. **SemanticSearch** (Tier 2): "Find API route patterns"
2. **Read** (Tier 1): Existing route file
3. **Write** (Tier 2): Create new route file
4. **Shell** (Tier 3): Run tests
5. **ReadLints** (Tier 3): Verify quality

### Example 2: Fix Login Bug (Automatic Tool Selection)
User: "Fix login bug"

Agent automatically selects:
1. **Grep** (Tier 1): Find login function
2. **Read** (Tier 1): Login code
3. **ReadLints** (Tier 3): Check for errors
4. **StrReplace** (Tier 2): Fix code
5. **Shell** (Tier 3): Run login tests

### Example 3: Large Refactor (Automatic Parallel Subagents)
User: "Migrate from JWT to sessions"

Agent automatically launches:
1. **Task** (4 parallel subagents, Tier 4):
   - "Find all JWT validation code"
   - "Find all token generation code"
   - "Find all authentication middleware"
   - "Find all tests using JWT"
2. **Checkpoint**: Before breaking changes
3. **StrReplace**: Incremental changes
4. **Shell**: Run tests after each change
5. **ReadLints**: Verify quality

---

**Note**: These rules apply automatically in debug mode. No manual tool selection needed.
