# Parallel Exploration Auto

## Automatic Parallel Subagent Deployment

### Complexity Thresholds (Automatic Triggers)

**Launch parallel subagents AUTOMATICALLY when**:

```
✓ Task mentions >3 different areas/directories
✓ Task complexity >10 steps (estimated)
✓ Bug investigation with unknown root cause
✓ Large refactor involving >5 files
✓ New feature spanning multiple layers (frontend + backend + tests)
✓ Codebase unfamiliarity detected (agent asks >3 clarifying questions)
✓ Investigation phase taking >5 minutes
```

---

## Subagent Configuration Templates

### Optimal Configuration (Automatic)
```yaml
Task:
  description: "Explore [specific area]"
  prompt: "Find [specific pattern/code] in [target directory]"
  subagent_type: "explore"
  model: "fast"  # Cost optimization
  readonly: true  # Safety
  run_in_background: true  # Non-blocking
  timeout: 120s  # Time-box exploration
```

### Subagent Count Rules
```
Task mentions 3-4 areas → Launch 4 subagents
Task mentions 5+ areas → Launch 4 subagents (diminishing returns)
Task complexity 10-15 steps → Launch 3 subagents
Task complexity 16+ steps → Launch 4 subagents
Bug investigation → Launch 4 subagents
Large refactor → Launch 4 subagents
```

---

## Parallel Exploration Patterns

### Pattern 1: Feature Implementation (Automatic)

**Trigger**: User requests new feature spanning multiple areas

**Example**: "Add user dashboard"

**Automatic Subagents** (model="fast", run_in_background=true):
```
Subagent 1: "Find dashboard-like pages and layouts in app/ and components/"
Subagent 2: "Find API route patterns for data fetching in app/api/"
Subagent 3: "Find component structures for widgets/cards in components/"
Subagent 4: "Find existing chart/visualization libraries and examples"
```

**Duration**: 60s parallel (vs 240s sequential)  
**Output**: Consolidated findings → Plan creation

---

### Pattern 2: Bug Investigation (Automatic)

**Trigger**: Bug report with unknown root cause

**Example**: "Checkout randomly fails"

**Automatic Subagents** (model="fast", run_in_background=true):
```
Subagent 1: "Find checkout flow code (UI → API → DB) in components/, app/api/, src/"
Subagent 2: "Find error handling in payment processing"
Subagent 3: "Find recent changes to checkout files (git history)"
Subagent 4: "Find similar issues/fixes in codebase and tests"
```

**Duration**: 90s parallel  
**Output**: Root cause hypothesis + fix locations

---

### Pattern 3: Large Refactor (Automatic)

**Trigger**: Refactor involving multiple files/areas

**Example**: "Migrate from JWT to sessions"

**Automatic Subagents** (model="fast", run_in_background=true):
```
Subagent 1: "Find all JWT validation code in src/auth/, middleware/, lib/"
Subagent 2: "Find all token generation code"
Subagent 3: "Find all authentication middleware and guards"
Subagent 4: "Find all tests using JWT tokens"
```

**Duration**: 120s parallel  
**Output**: Complete migration map + risk assessment

---

### Pattern 4: Codebase Onboarding (Automatic)

**Trigger**: Agent demonstrates unfamiliarity with codebase

**Automatic Subagents** (model="fast", run_in_background=true):
```
Subagent 1: "Map project structure and key directories"
Subagent 2: "Find main entry points and configuration files"
Subagent 3: "Identify core business logic files"
Subagent 4: "Find testing patterns and example tests"
```

**Duration**: 60s parallel  
**Output**: Codebase map for efficient navigation

---

## Cost Optimization Rules

### Subagent Cost Hierarchy
```
explore (fast model): $     ← Use for discovery (90% of cases)
generalPurpose (fast): $$   ← Use for analysis
generalPurpose (capable): $$$ ← Use for complex reasoning
browser-use: $$$$           ← Use only when browser needed
```

### Mandatory Cost Rules
```
1. ALWAYS use model="fast" for exploration subagents
2. ALWAYS use readonly=true unless modification explicitly needed
3. ALWAYS use run_in_background=true for non-blocking execution
4. LIMIT to 4 parallel subagents max (diminishing returns after 4)
5. TIME-BOX to 120s max per subagent
6. PREFER explore subagent_type over generalPurpose for discovery
```

---

## Consolidation Strategy

### After Parallel Exploration Completes (Automatic)

**Step 1: Aggregate Findings**
```
- Collect all subagent outputs
- Remove duplicates
- Organize by category/file type
```

**Step 2: Identify Patterns**
```
- Common patterns across findings
- Conflicting information (flag for review)
- Gaps in coverage (launch additional subagent if needed)
```

**Step 3: Create Action Plan**
```
- Map findings to implementation steps
- Identify file locations for changes
- Estimate complexity and risks
- Create TodoWrite tracking if >3 steps
```

**Step 4: Present Summary**
```
Format:
## Exploration Summary

### Key Findings
- [Finding 1] → [File/Location]
- [Finding 2] → [File/Location]

### Patterns Identified
- [Pattern 1] used in [X files]
- [Pattern 2] recommended for [use case]

### Recommended Next Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Files to Modify
- [File 1] - [Reason]
- [File 2] - [Reason]
```

---

## Automatic Triggers by Task Type

### Feature Development
```
Task involves: "Add [feature]", "Create [feature]", "Implement [feature]"
Check: Does feature span >3 file types or directories?
Action: Launch 3-4 parallel subagents
```

### Bug Fixes
```
Task involves: "Fix bug", "Issue with", "Not working", "Error in"
Check: Is root cause unknown or complex?
Action: Launch 4 parallel subagents for investigation
```

### Refactoring
```
Task involves: "Refactor", "Migrate", "Replace", "Update [system]"
Check: Does refactor involve >5 files?
Action: Launch 4 parallel subagents to map all usages
```

### Performance Optimization
```
Task involves: "Optimize", "Slow", "Performance", "Improve speed"
Check: Is performance issue source unknown?
Action: Launch 3 parallel subagents
  - Subagent 1: Find bottleneck candidates
  - Subagent 2: Find optimization patterns
  - Subagent 3: Find performance tests/benchmarks
```

### Security Review
```
Task involves: "Security", "Vulnerability", "Audit", "Review"
Check: Is comprehensive review needed?
Action: Launch 4 parallel subagents
  - Subagent 1: Find authentication code
  - Subagent 2: Find authorization code
  - Subagent 3: Find input validation
  - Subagent 4: Find data protection
```

---

## Quality Control

### Subagent Prompt Quality (Automatic Checks)
```
✓ Prompt is specific (mentions exact patterns/files to find)
✓ Prompt includes target directories
✓ Prompt defines success criteria
✓ Prompt is concise (<200 words)
```

### Subagent Output Validation (Automatic)
```
✓ Output includes file paths
✓ Output includes code examples
✓ Output is actionable
✓ Output cites sources (file:line)
```

### Fallback Protocol
```
Subagent times out? → Retry once with narrower scope
Subagent returns empty? → Broaden search parameters
Subagent confused? → Provide more specific prompt
All subagents fail? → Escalate to manual exploration
```

---

## Examples

### Example 1: Add Authentication System

**User Request**: "Add OAuth authentication to login flow"

**Automatic Parallel Subagents**:
```
Subagent 1: "Find current authentication flow in src/auth/, app/api/auth/"
Subagent 2: "Find OAuth libraries and examples in package.json, existing code"
Subagent 3: "Find login UI components in components/auth/, app/login/"
Subagent 4: "Find authentication tests in __tests__/auth/"
```

**Result**: Complete map of auth system in 60s → Implementation plan

---

### Example 2: Debug Random Crashes

**User Request**: "App crashes randomly on startup"

**Automatic Parallel Subagents**:
```
Subagent 1: "Find app initialization code in main.ts, app/, src/index.ts"
Subagent 2: "Find error handling and crash reporting"
Subagent 3: "Find recent changes to startup code (git log)"
Subagent 4: "Find similar crash reports in issues, tests, comments"
```

**Result**: Root cause identified in 90s → Fix location pinpointed

---

### Example 3: Migrate Database ORM

**User Request**: "Migrate from Prisma to Drizzle ORM"

**Automatic Parallel Subagents**:
```
Subagent 1: "Find all Prisma schema and models in prisma/, src/models/"
Subagent 2: "Find all database queries using Prisma client"
Subagent 3: "Find all database migrations and seeds"
Subagent 4: "Find all tests using Prisma"
```

**Result**: Complete migration map in 120s → Step-by-step plan

---

## Anti-Patterns to Avoid

### ❌ Launching Subagents for Simple Tasks
**Bad**: Using subagent to find single file (use Read or Glob)  
**Good**: Use subagents for broad exploration only

### ❌ Too Many Subagents
**Bad**: Launching 8+ subagents (chaotic, diminishing returns)  
**Good**: Limit to 4 max

### ❌ Vague Prompts
**Bad**: "Find authentication code"  
**Good**: "Find JWT validation code in src/auth/, middleware/, and lib/"

### ❌ No Time Boxing
**Bad**: Subagents running for 10+ minutes  
**Good**: 120s max per subagent

### ❌ Not Using Fast Model
**Bad**: Using capable model for simple exploration  
**Good**: Use fast model for 90% of exploration tasks

---

## Monitoring and Metrics

### Track for Optimization
```
- Subagent success rate (target: >80%)
- Average exploration time (target: <90s)
- Token cost per exploration (target: optimize over time)
- User satisfaction with findings (target: >4/5)
```

### Continuous Improvement
```
After each parallel exploration:
1. Did subagents find what was needed?
2. Could cheaper tools have worked?
3. Was prompt specific enough?
4. Should time box be adjusted?
```

---

**Note**: These rules apply automatically in debug mode. Parallel subagents launch based on task complexity without manual intervention.
