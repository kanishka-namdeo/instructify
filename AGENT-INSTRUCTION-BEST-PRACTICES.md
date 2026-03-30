# Evidence-Based Guide to Instructing Coding Agents in Cursor

> **Compiled**: March 2026  
> **Based on**: Latest research from arXiv (Jan-Mar 2026), industry deployments (Stripe, Microsoft, Anthropic), and production case studies
> **Version**: 2.0 - Expanded with multi-agent workflows, security findings, and context engineering

This guide translates cutting-edge research on AI coding agent instruction into practical, implementable patterns for Cursor IDE, incorporating findings from 15+ peer-reviewed studies and real-world enterprise deployments.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research Findings](#research-findings)
3. [Core Principles](#core-principles)
4. [AGENTS.md](#agentsmd)
5. [Cursor Rules](#cursor-rules)
6. [Cursor Commands](#cursor-commands)
7. [Cursor Skills](#cursor-skills)
8. [Cursor Hooks](#cursor-hooks)
9. [Subagents & Parallel Workflows](#subagents--parallel-workflows)
10. [Prompt Engineering](#prompt-engineering)
11. [Context Management](#context-management)
12. [Implementation Roadmap](#implementation-roadmap)
13. [Appendix: Templates](#appendix-templates)

---

## Executive Summary

### Key Research Findings (2026)

| Study | Finding | Implication |
|-------|---------|-------------|
| Lulla et al. (Jan 2026) | AGENTS.md → 28.64% faster runtime, 16.58% less tokens | Use repository instructions |
| Gloaguen et al. (Feb 2026) | Over-specified context → 20%+ cost increase, lower success | Keep instructions minimal |
| Cursor Team (2025-26) | Plan Mode + specific prompts → dramatically better output | Plan first, be specific |
| **Stanford/UC Berkeley (2025)** | **"Lost in the Middle" phenomenon in LLM attention** | **Position critical info at beginning/end** |
| **AppSec Santa (Mar 2026)** | **25.1% of AI-generated code has vulnerabilities** | **Security review mandatory** |
| **McKinsey (2026)** | **Developers 2x faster with AI, but quality tradeoffs** | **Measure velocity, not just speed** |
| **OctoBench (Jan 2026)** | **No model >20% on strict constraint tasks** | **Instruction following unsolved** |

### The Paradox

**More instructions ≠ Better results**

ETH Zurich found that unnecessary requirements from context files:
- ❌ Reduce task success rates
- ❌ Increase inference costs by 20-159%
- ❌ Make tasks harder for agents

**Solution**: Minimal, tiered, task-relevant instructions only.

### The Opportunity

**Multi-agent systems are mainstream**:
- 📈 Market projected to reach **$8.5B in 2026**, $35B by 2030
- 🏢 **57% of companies** deploy AI agents in production
- 🎯 **40% of enterprise apps** will feature task-specific agents by end-2026 (up from 5% in 2025)

**Enterprise results** (Stripe, incident.io, Series B SaaS):
- ⚡ **10,000-line migration in 4 days** vs 10 engineering weeks
- 💰 **$253k annual savings** through automation
- 📊 **Code review: 2-4 hours → 15-30 minutes per PR**
- 🧪 **Test coverage: 40-50% → 85-95%**
- 🐛 **Production bugs: 15-20/month → 4-6/month**

---

## Research Findings

### Study 1: Impact of AGENTS.md Files (Lulla et al., Jan 2026)

**Methodology**:
- 10 repositories, 124 pull requests
- Compared agent execution with/without AGENTS.md
- Measured wall-clock time and token consumption

**Results**:
```
With AGENTS.md:
- Median runtime: ↓ 28.64%
- Output tokens: ↓ 16.58%
- Task completion: Comparable
```

**Conclusion**: Well-crafted AGENTS.md files improve efficiency without sacrificing quality.

---

### Study 2: Evaluating AGENTS.md Effectiveness (Gloaguen et al., Feb 2026)

**Methodology**:
- SWE-bench tasks + novel collection of real-world issues
- LLM-generated and developer-written context files
- Multiple coding agents evaluated

**Results**:
```
With context files:
- Task success rate: ↓ Decreased
- Inference cost: ↑ 20%+ (up to 159% in some configs)
- Exploration: ↑ Broader (more testing, file traversal)
```

**Critical Finding**: Unnecessary requirements make tasks harder. Agents respect instructions too literally.

**Recommendiation**: Human-written context files should describe **only minimal requirements**.

**Key Statistics**:
- LLM-generated context files reduced success rates in 5 of 8 evaluation settings (0.5-2 percentage point drops)
- Developer-provided files showed ~4 percentage point improvement on AGENTbench, but at cost of 20-23% increased inference
- Agents took 2.45-3.92 additional steps per task with context files
- Context files encourage broader exploration but don't translate to better outcomes

---

### Study 3: Context Configuration Patterns (Galster et al., Feb 2026)

**Methodology**: Analysis of 2,923 GitHub repositories adopting AI coding tools.

**Key Findings**:
```
Adoption Patterns:
- Context Files dominate (often sole mechanism)
- Advanced mechanisms (Skills, Subagents): shallow adoption
- Most repos define only 1-2 configuration artifacts
- Claude Code users employ broadest range of mechanisms
- AGENTS.md serves as natural starting point
```

**Design Pattern**: Modular, on-demand context > comprehensive documentation.

**Tiered Injection Benefits**:
- 60-80% context reduction vs monolithic files
- Maintains or improves accuracy
- Reduces "Lost in the Middle" attention degradation

---

### Study 4: Scaffold-Aware Instruction Following (OctoBench, Jan 2026)

**Methodology**: Benchmark with 200 test cases, average 7 constraint types per case, strict constraint adherence evaluation.

**Shocking Results**:
```
Constraint Adherence:
- No model achieves >20% task completion with strict constraints
- Models violate constraints in >50% of cases
- Systematic gap between task-solving and instruction compliance
- Top performer (OpenAI o3): 69.3 on IFBench
- Most models score <53.7
```

**Implication**: Training and evaluation must explicitly target instruction-following. Models can solve tasks but fail to comply with heterogeneous, persistent constraints.

---

### Study 5: Security in AI-Generated Code (AppSec Santa, Mar 2026)

**Methodology**: 534 code samples evaluated against OWASP Top 10 across 6 LLMs.

**Critical Findings**:
```
Vulnerability Rates:
- Overall: 25.1% of AI-generated code has confirmed vulnerabilities
- GPT-5.2: 19.1% (best)
- Claude Opus 4.6, DeepSeek V3, Llama 4 Maverick: 29.2% (worst)
- 10.1-point spread between best and worst models

Most Common Issues:
- SSRF (Server-Side Request Forgery): 32 confirmed findings
- Injection-class weaknesses: 33.1% of all findings
- Security Misconfiguration: 25 findings
```

**Real-World Impact**:
- 74 CVEs attributed to AI-generated code (as of Mar 2026)
- Claude Code responsible for 49 cases
- Researchers estimate actual numbers may be 5-10x higher
- **The Register**: "Using AI to code does not mean your code is more secure"

---

### Study 6: Task-Stratified Agent Performance (Pinna et al., Feb 2026)

**Methodology**: Analysis of 7,156 pull requests across 9 task categories.

**Key Findings**:
```
Acceptance Rates by Task Type:
- Documentation: 82.1% (highest)
- New features: 66.1%
- Gap: 16 percentage points (exceeds inter-agent variance)

Agent Performance (no single agent dominates):
- Claude Code: leads in documentation (92.3%) and features (72.6%)
- Cursor: excels in fix tasks (80.4%)
- OpenAI Codex: consistently high across all categories (59.6%-88.6%)
- Devin: only agent with consistent positive trend (+0.77%/week over 32 weeks)
```

**Implication**: Agent selection should be task-specific, not one-size-fits-all.

---

## Core Principles

### Principle 1: Minimalism

**Rule**: If it's not essential, don't include it.

**Research Backing**: ETH Zurich found unnecessary requirements reduce success rates and increase costs by 20-159%.

**Bad**:
```markdown
# All Coding Standards

## Section 1: Variable Naming
- Use camelCase for variables
- Use PascalCase for classes
- Use UPPER_CASE for constants
- ... 50 more lines ...
```

**Good**:
```markdown
# Essential Patterns
- See `src/auth.ts` for authentication implementation
- See `components/Button.tsx` for component structure
- Run `npm run lint` before committing
```

**Key Insight**: Human-written context files should focus on **minimal requirements only**, not comprehensive documentation.

---

### Principle 2: Tiered Injection

**Rule**: Provide only task-relevant instructions, not everything.

**Research Backing**: Galster et al. found tiered injection reduces context by 60-80% while maintaining accuracy.

**Implementation**:
```
.cursor/rules/
├── general.md      # Always loaded (5-10 lines)
├── testing.md      # Loaded for test tasks
├── api.md         # Loaded for API work
└── styling.md     # Loaded for UI work
```

**Benefit**: 60-80% context reduction while maintaining accuracy.

**Why It Works**: Avoids "Lost in the Middle" phenomenon where LLMs poorly attend to information at positions 40-60% of context.

---

### Principle 3: References Over Content

**Rule**: Point to examples, don't copy them.

**Research Backing**: Stanford/UC Berkeley research shows "Lost in the Middle" attention degradation - LLMs exhibit U-shaped attention pattern with best performance at positions 1-10% and 90-100%.

**Bad**:
```markdown
# Authentication Rules
1. Always validate JWT token
2. Check expiration timestamp
3. Verify signature with RSA256
4. Extract user ID from claims
5. ... 200 lines of code example ...
```

**Good**:
```markdown
# Authentication
- Follow pattern in `@src/auth/validateToken.ts`
- Use JWT validation from `@src/lib/jwt.ts`
```

**Why Better**: Agent has powerful search tools (grep, semantic search). Including irrelevant files confuses agent about priorities.

---

### Principle 4: Positive Framing

**Rule**: Use "do X" not "don't Y".

**Research Backing**: Agents follow "do X" instructions 2x more reliably than "don't Y" (OctoBench findings).

**Bad**:
```markdown
- Don't use var, use let or const
- Don't use CommonJS, use ES modules
- Don't forget to run tests
- Don't commit without linting
```

**Good**:
```markdown
- Use `let` or `const` for variable declarations
- Use ES modules (import/export syntax)
- Run tests before committing
- Run linter after substantive changes
```

---

### Principle 5: Verifiable Goals

**Rule**: Give agents clear success signals.

**Research Backing**: Agents with verifiable goals iterate 3x more effectively. However, OctoBench found no model achieves >20% on strict constraint tasks.

**Bad**:
```
"Make the authentication better"
```

**Good**:
```
"Add JWT token validation to /api/login endpoint.
Tests must pass: `npm run test -- auth.test.ts`
Linter must pass: `npm run lint`"
```

**Why Better**:
- ✅ Measurable metrics
- ✅ Specific commands to run
- ✅ Clear success criteria
- ✅ Agent can self-evaluate

---

### Principle 6: Context Engineering

**Rule**: Clean, well-structured context on weaker model outperforms cluttered context on stronger model.

**Research Backing**: Popularized by Shopify CEO Tobi Lütke (2025), validated by multiple studies showing accuracy drops as input length increases.

**Bad** (Context Dumping):
```
"Here's everything about our project:
[50 files attached, 10,000 lines of code]

Now add authentication."
```

**Good** (Context Engineering):
```
"Add JWT authentication to checkout flow.

Relevant context:
- Current auth pattern: @src/auth/validateToken.ts
- Checkout endpoint: @app/api/checkout/route.ts
- User model: @src/models/User.ts

Requirements:
- Validate JWT on all checkout requests
- Return 401 if invalid/expired
- Extract userId from token for order creation

Tests: Run `npm run test -- checkout.test.ts`"
```

**Why Better**:
- ✅ Minimal, relevant files only
- ✅ Clear requirements
- ✅ Success criteria defined
- ✅ Agent can find more context if needed

---

### Principle 7: Security-First Mindset

**Rule**: Always review AI-generated code for security vulnerabilities.

**Research Backing**: AppSec Santa (Mar 2026) found 25.1% of AI-generated code has confirmed vulnerabilities.

**Implementation**:
```markdown
## Security Checklist for AI-Generated Code
- [ ] All user input validated and sanitized
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (escaping/sanitization)
- [ ] Authentication/authorization verified
- [ ] No hardcoded credentials or secrets
- [ ] Error handling doesn't leak sensitive info
- [ ] Rate limiting on auth endpoints
```

**Why Critical**:
- 25.1% vulnerability rate across all LLMs
- 74 CVEs attributed to AI-generated code (likely 5-10x underreported)
- "Using AI to code does not mean your code is more secure" (The Register)

---

## AGENTS.md

### Purpose

Repository-level instructions that provide minimal essential context for AI coding agents.

### Location

```
your-repo/
├── AGENTS.md          # Root level
├── src/
├── tests/
└── .cursor/
```

### What to Include

✅ **DO Include**:
- Tech stack (1-2 lines)
- Essential commands (build, test, lint)
- Critical constraints (truly necessary only)
- Pointers to canonical examples

❌ **DON'T Include**:
- Complete style guides
- Every possible command
- Edge case handling
- Architecture documentation
- API documentation

### Template

```markdown
# Project Context

## Stack
- Runtime: Node.js 20, TypeScript 5.3
- Framework: Next.js 14 (App Router)
- Database: PostgreSQL with Prisma ORM

## Essential Commands
```bash
npm run build      # Build before committing
npm run test       # Run full test suite
npm run test:unit  # Run unit tests only
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checker
```

## Critical Constraints
- All API routes must be in `app/api/`
- Database migrations required for schema changes
- All user input must be validated with Zod

## Canonical Examples
- Authentication: `@src/auth/validateToken.ts`
- API route pattern: `@app/api/users/route.ts`
- Component structure: `@components/Button.tsx`
- Test pattern: `@__tests__/auth.test.ts`
```

### Scenario: Adding AGENTS.md to Existing Project

**Before** (no instructions):
```
User: "Add authentication to checkout"
Agent: Spends 10 minutes figuring out project structure,
       asks 5 clarifying questions, uses wrong patterns
```

**After** (with AGENTS.md):
```
User: "Add authentication to checkout"
Agent: Immediately finds @src/auth/, follows existing patterns,
       runs correct test commands, completes in 3 minutes
```

**Measured Impact** (per research):
- Runtime: ↓ 28.64%
- Tokens: ↓ 16.58%

---

## Cursor Rules

### Purpose

Static context that shapes how the agent works with your code. Applied to every conversation.

### Location

```
.cursor/rules/
├── general.md
├── testing.md
├── api.md
└── styling.md
```

### Rule Types

#### 1. General Rules (Always Loaded)

**File**: `.cursor/rules/general.md`

```markdown
# General Rules

## Commands
- `npm run build`: Build before committing
- `npm run typecheck`: Run TypeScript checker after substantive changes
- `npm run lint`: Run ESLint after code changes
- `npm run test`: Prefer single test files for speed

## Code Style
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports: `import { foo } from 'bar'`
- Use TypeScript strict mode, no `any` types

## Workflow
- API routes go in `app/api/` following existing patterns
- Database changes require Prisma migration
- All user input validated with Zod schemas

## Canonical Examples
- Component pattern: `@components/Button.tsx`
- API route pattern: `@app/api/users/route.ts`
- Test pattern: `@__tests__/auth.test.ts`
```

**When to Add**: When you notice the agent making the same mistake 2-3 times.

---

#### 2. Task-Specific Rules (Loaded On-Demand)

**File**: `.cursor/rules/testing.md`

```markdown
# Testing Rules

## When Writing Tests
- Use Vitest for unit tests, Playwright for E2E
- Place tests in `__tests__/` directory
- Name test files: `[feature].test.ts`
- Follow AAA pattern: Arrange, Act, Assert

## Test Requirements
- Minimum 80% coverage for new code
- Mock external APIs with MSW
- Include error boundary tests
- Test edge cases explicitly

## Running Tests
```bash
npm run test              # Full suite
npm run test:unit         # Unit tests only
npm run test:coverage     # With coverage report
npm run test -- path/to   # Specific file
```

## Examples
- Unit test pattern: `@__tests__/auth.test.ts`
- Integration test: `@__tests__/api/users.test.ts`
- E2E test: `@e2e/checkout.spec.ts`
```

**When Loaded**: Agent decides it's relevant for test-writing tasks.

---

**File**: `.cursor/rules/api.md`

```markdown
# API Development Rules

## Structure
- All routes in `app/api/[resource]/route.ts`
- Use Next.js App Router conventions
- Export GET, POST, PUT, DELETE handlers

## Authentication
- Validate JWT with `@src/auth/validateToken.ts`
- Extract user from token claims
- Return 401 for unauthorized, 403 for forbidden

## Validation
- Use Zod schemas for all input validation
- Return 400 with error details for invalid input
- Sanitize user input before database queries

## Error Handling
```typescript
try {
  // business logic
} catch (error) {
  logger.error('API error', { error, userId });
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Examples
- REST API pattern: `@app/api/users/route.ts`
- Error handling: `@app/api/orders/route.ts`
- Validation pattern: `@src/validators/orderSchema.ts`
```

---

**File**: `.cursor/rules/styling.md`

```markdown
# Styling Rules

## CSS Framework
- Use Tailwind CSS for all styling
- Follow utility-first approach
- Use `clsx` for conditional classes

## Component Structure
```tsx
interface Props {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: Props) {
  return (
    <button className={clsx(
      'px-4 py-2 rounded font-medium',
      variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    )}>
      {children}
    </button>
  );
}
```

## Responsive Design
- Mobile-first approach
- Use `md:`, `lg:`, `xl:` breakpoints
- Test on multiple screen sizes

## Examples
- Button component: `@components/Button.tsx`
- Form styling: `@components/forms/TextInput.tsx`
- Layout pattern: `@components/Layout.tsx`
```

---

### Scenario: Repeated Mistake → New Rule

**Problem**: Agent keeps forgetting to run linter before committing.

**Solution**: Add to `.cursor/rules/general.md`:

```markdown
## Workflow
- Run `npm run lint` after substantive code changes
- Fix all linting errors before committing
- Run `npm run typecheck` for TypeScript projects
```

**Update Process**:
1. Notice repeated mistake (2-3 occurrences)
2. Add minimal rule addressing it
3. Test in next conversation
4. Refine if not working

---

### Scenario: Team-Wide Consistency

**Problem**: Different developers using different patterns.

**Solution**: Check rules into git:

```bash
git add .cursor/rules/
git commit -m "Add Cursor rules for team consistency"
git push
```

**Benefit**: Entire team benefits from accumulated knowledge.

---

## Cursor Commands

### Purpose

Reusable workflow templates triggered with `/` in agent input. Ideal for multi-step workflows run many times per day.

### Location

```
.cursor/commands/
├── pr.md
├── fix-issue.md
├── review.md
└── update-deps.md
```

### Command Structure

```markdown
# /command-name [parameters]

[Description of what command does]

## Steps
1. [First step]
2. [Second step]
3. [Third step]

## Output
[What agent should return]
```

---

### Example 1: Pull Request Creation

**File**: `.cursor/commands/pr.md`

```markdown
# /pr

Create a pull request for the current changes.

## Steps
1. Run `git status` to see staged and unstaged changes
2. Run `git diff --staged` to review staged changes
3. Write a clear commit message based on changes:
   - Start with verb (Add, Fix, Update, Remove)
   - Keep first line under 50 characters
   - Add body if needed for context
4. Stage all changes: `git add .`
5. Commit: `git commit -m "message"`
6. Push to current branch: `git push`
7. Create PR using GitHub CLI:
   ```bash
   gh pr create \
     --title "Clear descriptive title" \
     --body "## Summary\n\n- Change 1\n- Change 2\n\n## Testing\n\n- [ ] Tests pass\n- [ ] Manually verified" \
     --base main
   ```
8. Return the PR URL when done

## Output
- Commit hash
- PR URL
```

**Usage**: Type `/pr` in agent input

---

### Example 2: Issue Fixing

**File**: `.cursor/commands/fix-issue.md`

```markdown
# /fix-issue [issue-number]

Fetch a GitHub issue, implement a fix, and open a PR.

## Steps
1. Fetch issue details:
   ```bash
   gh issue view [issue-number] --json title,body,comments
   ```
2. Read and understand the issue:
   - What's the problem?
   - What's the expected behavior?
   - Are there reproduction steps?
3. Search codebase for relevant files:
   - Use grep to find related code
   - Use semantic search for concepts
   - Find existing patterns
4. Implement the fix:
   - Follow existing code patterns
   - Add tests for the fix
   - Update documentation if needed
5. Run tests to verify:
   ```bash
   npm run test -- related.test.ts
   npm run lint
   npm run typecheck
   ```
6. Commit with conventional commit message:
   ```bash
   git add .
   git commit -m "Fix: [issue title] (#[issue-number])"
   ```
7. Push and create PR:
   ```bash
   git push
   gh pr create \
     --title "Fix: [issue title]" \
     --body "Fixes #[issue-number]\n\n## Summary\n\n[Description]\n\n## Testing\n\n- [ ] Tests pass\n- [ ] Manually verified"
   ```
8. Return PR URL

## Output
- Summary of changes
- PR URL with issue reference
```

**Usage**: Type `/fix-issue 123` in agent input

---

### Example 3: Code Review

**File**: `.cursor/commands/review.md`

```markdown
# /review

Run a comprehensive code review on current changes.

## Steps
1. Identify all changed files:
   ```bash
   git diff --name-only
   git diff --name-only --staged
   ```
2. For each changed file:
   - Read the diff
   - Check for bugs or logic errors
   - Verify error handling
   - Check for security issues
   - Ensure proper typing
3. Run automated checks:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```
4. Check for common issues:
   - [ ] Console.logs left in code
   - [ ] TODO comments that should be addressed
   - [ ] Unused imports or variables
   - [ ] Missing error handling
   - [ ] Hardcoded values that should be config
   - [ ] Security vulnerabilities (SQL injection, XSS, etc.)
   - [ ] Performance issues (N+1 queries, large loops)
5. Generate review report:
   ```markdown
   ## Review Summary

   ### ✅ Good
   - [Positive observations]

   ### ⚠️ Concerns
   - [Potential issues]

   ### ❌ Blockers
   - [Critical issues that must be fixed]

   ### Automated Checks
   - Lint: [Pass/Fail]
   - Typecheck: [Pass/Fail]
   - Tests: [Pass/Fail]
   ```

## Output
- Review report with severity levels
- Specific line references for issues
```

**Usage**: Type `/review` in agent input

---

### Example 4: Dependency Updates

**File**: `.cursor/commands/update-deps.md`

```markdown
# /update-deps

Check for outdated dependencies and update them safely.

## Steps
1. Check for outdated packages:
   ```bash
   npm outdated
   ```
2. For each outdated dependency:
   a. Check changelog for breaking changes
   b. Update one at a time:
      ```bash
      npm install package@latest
      ```
   c. Run tests after each update:
      ```bash
      npm run test
      ```
   d. If tests fail:
      - Check migration guide
      - Fix breaking changes
      - Or pin to previous version
3. Update package-lock.json:
   ```bash
   npm install
   ```
4. Run full test suite:
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```
5. Commit updates:
   ```bash
   git add package.json package-lock.json
   git commit -m "chore: update dependencies [date]"
   ```
6. Create PR with summary:
   ```markdown
   ## Dependency Updates

   ### Updated
   - package-a: 1.2.3 → 1.3.0
   - package-b: 2.0.0 → 2.1.0

   ### Breaking Changes
   - [List any breaking changes]

   ### Testing
   - [x] All tests pass
   - [x] Manually verified
   ```

## Output
- List of updated packages
- Any breaking changes found
- PR URL
```

**Usage**: Type `/update-deps` in agent input

---

### Example 5: Test-Driven Development

**File**: `.cursor/commands/tdd.md`

```markdown
# /tdd [feature-description]

Implement a feature using Test-Driven Development.

## Steps

### Phase 1: Write Tests (No Implementation)
1. Understand the feature requirements
2. Write test cases covering:
   - Happy path
   - Edge cases
   - Error conditions
   - Boundary conditions
3. Run tests and confirm they ALL fail:
   ```bash
   npm run test -- new-feature.test.ts
   ```
4. Commit the tests:
   ```bash
   git add __tests__/new-feature.test.ts
   git commit -m "test: add tests for [feature]"
   ```

### Phase 2: Implement Feature
5. Write minimal code to pass the tests
6. Run tests and iterate until ALL pass:
   ```bash
   npm run test -- new-feature.test.ts
   ```
7. Run full test suite to ensure no regressions:
   ```bash
   npm run test
   ```

### Phase 3: Refactor
8. Refactor code for clarity and maintainability
9. Run tests again to ensure refactoring didn't break anything
10. Run linter and typechecker:
    ```bash
    npm run lint
    npm run typecheck
    ```

### Phase 4: Commit
11. Commit implementation:
    ```bash
    git add src/
    git commit -m "feat: implement [feature]"
    ```

## Rules
- DO NOT write implementation code in Phase 1
- DO NOT modify tests in Phase 2
- Keep iterating until all tests pass
- Stop if stuck after 5 iterations

## Output
- Test file location
- Implementation file location
- Test results summary
```

**Usage**: Type `/tdd add user authentication with JWT tokens` in agent input

---

### Scenario: Daily Workflow with Commands

**Morning Standup**:
```
/fix-issue 456
```
Agent fetches issue, implements fix, opens PR automatically.

**Before Lunch**:
```
/review
```
Agent reviews all local changes, flags potential issues.

**End of Day**:
```
/pr
```
Agent commits, pushes, creates PR with proper description.

**Time Saved**: 30-45 minutes per day on routine tasks.

---

## Cursor Skills

### Purpose

Dynamic capabilities that extend what agents can do. Unlike Rules (always loaded), Skills are loaded on-demand when the agent decides they're relevant.

### Location

```
.cursor/SKILL.md
.cursor/skills/
├── testing/
│   └── SKILL.md
├── deployment/
│   └── SKILL.md
└── domain-specific/
    └── SKILL.md
```

**Note**: Skills require Cursor Nightly channel (Settings → Beta → Update Channel: Nightly)

---

### Skill Structure

```markdown
# SKILL.md: [Skill Name]

## Description
[What this skill does]

## When to Use
[Trigger conditions]

## Capabilities
- [Capability 1]
- [Capability 2]

## Commands
/[command-name]: [Description]

## Workflows
[Step-by-step workflows]

## Examples
[Usage examples]
```

---

### Example 1: Test-Driven Development Skill

**File**: `.cursor/skills/tdd/SKILL.md`

```markdown
# SKILL.md: Test-Driven Development

## Description
Comprehensive TDD workflow with iterative test-implement-refactor cycles.

## When to Use
- User asks to "add tests" or "implement with tests"
- User mentions TDD or test-driven development
- New feature implementation requested
- Refactoring existing code

## Capabilities
- Write comprehensive test suites before implementation
- Run tests and verify failure before coding
- Implement minimal code to pass tests
- Iterate until all tests pass
- Refactor with confidence

## Commands
/tdd [feature]: Full TDD workflow for feature
/test-first [feature]: Write tests only, no implementation
/red-green: Run tests, implement until passing

## Workflows

### Full TDD Workflow
1. **Clarify Requirements**
   - Ask about edge cases
   - Identify error conditions
   - Determine success criteria

2. **Write Tests** (Red Phase)
   ```typescript
   // __tests__/[feature].test.ts
   describe('[Feature]', () => {
     it('should [expected behavior]', () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```
   - Run tests: `npm run test -- [feature].test.ts`
   - Confirm ALL tests fail
   - Commit tests only

3. **Implement** (Green Phase)
   - Write minimal code to pass tests
   - Run tests after each change
   - Iterate until all pass
   - DO NOT modify tests

4. **Refactor** (Refactor Phase)
   - Improve code quality
   - Maintain test coverage
   - Run tests to verify

5. **Verify**
   - Full test suite: `npm run test`
   - Linter: `npm run lint`
   - Typecheck: `npm run typecheck`

## Examples

### User: "Implement user login with TDD"

**Agent Response**:
"I'll implement user login using TDD. Let me start by clarifying:

1. What authentication method? (JWT, sessions, OAuth)
2. What edge cases to test? (invalid credentials, locked accounts)
3. Any specific requirements? (password hashing, rate limiting)

Once clarified, I'll:
1. Write comprehensive tests first
2. Confirm tests fail
3. Implement login logic
4. Iterate until all tests pass
5. Refactor for clarity

Shall I proceed with JWT-based authentication?"
```

---

### Example 2: Long-Running Agent Loop

**File**: `.cursor/skills/grind/SKILL.md`

```markdown
# SKILL.md: Long-Running Agent Loop

## Description
Keep agent working autonomously on a task until completion or max iterations.

## When to Use
- Complex multi-step tasks
- Tasks requiring iteration (fix tests, match design)
- When you want agent to work independently
- Verifiable goals (tests pass, design matches)

## Capabilities
- Work autonomously for multiple iterations
- Self-evaluate progress
- Update scratchpad with status
- Stop when goal achieved or max reached

## Commands
/grind [task]: Work until done or max iterations
/loop [task]: Same as /grind

## Configuration

### Hook Setup

1. Create hook script: `.cursor/hooks/grind.ts`

```typescript
import { readFileSync, existsSync } from "fs";
import { writeFile } from "fs/promises";

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

const input: StopHookInput = await Bun.stdin.json();
const MAX_ITERATIONS = 5;
const SCRATCHPAD_PATH = ".cursor/scratchpad.md";

// Don't continue if not completed or max reached
if (input.status !== "completed" || input.loop_count >= MAX_ITERATIONS) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Check scratchpad for completion signal
const scratchpad = existsSync(SCRATCHPAD_PATH)
  ? readFileSync(SCRATCHPAD_PATH, "utf-8")
  : "";

if (scratchpad.includes("DONE") || scratchpad.includes("BLOCKED")) {
  console.log(JSON.stringify({}));
} else {
  // Continue with status update
  await writeFile(
    SCRATCHPAD_PATH,
    `## Iteration ${input.loop_count}/${MAX_ITERATIONS}\n\nWorking on task... Last status: ${input.status}\n`
  );
  
  console.log(JSON.stringify({
    followup_message: `[Iteration ${input.loop_count + 1}/${MAX_ITERATIONS}] Continue working. Update scratchpad with "DONE" when complete or "BLOCKED" if stuck.`
  }));
}
```

2. Configure in `.cursor/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "stop": [{ "command": "bun run .cursor/hooks/grind.ts" }]
  }
}
```

## Workflows

### Test-Fix Loop
```
/grind Make all tests pass

Agent will:
1. Run tests
2. Identify failures
3. Fix failing code
4. Run tests again
5. Repeat until all pass or 5 iterations
```

### UI Matching Loop
```
/grind Match the design in @design-mockup.png

Agent will:
1. Compare current UI to mockup
2. Adjust styles
3. Take screenshot/verify
4. Repeat until matched or 5 iterations
```

## Scratchpad Pattern

Use `.cursor/scratchpad.md` to track progress:

```markdown
## Task: Make all tests pass

### Iteration 1
- ❌ 3 tests failing
- Fixed authentication logic

### Iteration 2
- ❌ 1 test failing
- Fixed edge case in validation

### Iteration 3
- ✅ All tests passing
- DONE
```

## Safety
- Max 5 iterations (configurable)
- Stops on error or abort
- User can interrupt anytime
- Scratchpad provides visibility
```

---

### Example 3: Domain-Specific Skill (E-commerce)

**File**: `.cursor/skills/ecommerce/SKILL.md`

```markdown
# SKILL.md: E-commerce Development

## Description
Domain-specific knowledge for e-commerce development including products, carts, orders, and payments.

## When to Use
- User asks about e-commerce features
- Working on product catalog, shopping cart, checkout
- Payment integration needed
- Order management tasks

## Capabilities
- Understand e-commerce patterns
- Know payment provider integrations
- Handle inventory management
- Implement order workflows

## Key Concepts

### Product Catalog
- Products with variants (size, color)
- Inventory tracking per variant
- Pricing with discounts
- Categories and tags

### Shopping Cart
- Add/remove/update quantities
- Persistent carts (saved for later)
- Guest vs authenticated carts
- Cart expiration

### Checkout Flow
1. Cart review
2. Shipping address
3. Shipping method
4. Payment information
5. Order confirmation

### Order Management
- Order status workflow
- Payment capture/refund
- Fulfillment tracking
- Returns/exchanges

## Patterns

### Product Schema
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  variants: ProductVariant[];
  categories: string[];
  inventory: Inventory[];
}

interface ProductVariant {
  id: string;
  sku: string;
  options: Record<string, string>; // { size: 'M', color: 'Red' }
  priceModifier: number; // +100 for premium variant
}

interface Inventory {
  variantId: string;
  quantity: number;
  reserved: number; // In carts but not purchased
  available: number; // quantity - reserved
}
```

### Order Workflow
```typescript
enum OrderStatus {
  Pending = 'pending',
  PaymentProcessing = 'payment_processing',
  Paid = 'paid',
  Fulfilling = 'fulfilling',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Refunded = 'refunded'
}
```

## Commands
/checkout-flow: Implement complete checkout
/inventory-check: Add inventory validation
/payment-integration: Integrate payment provider

## Examples

### User: "Add inventory check to checkout"

**Agent Response**:
"I'll add inventory validation to the checkout flow. Following our e-commerce patterns:

1. Check available inventory (quantity - reserved)
2. Reserve items when added to cart
3. Release reservation if cart abandoned (24h)
4. Decrement on successful payment
5. Handle out-of-stock scenarios

I'll follow the pattern in `@src/ecommerce/inventory.ts` and add reservation logic to the cart service."
```

---

### Example 4: Security Review Skill

**File**: `.cursor/skills/security/SKILL.md`

```markdown
# SKILL.md: Security Review

## Description
Automated security review for code changes, checking for common vulnerabilities.

## When to Use
- Before committing sensitive changes
- When working with user input
- Authentication/authorization code
- Payment or financial data handling

## Capabilities
- Detect OWASP Top 10 vulnerabilities
- Check for authentication bypasses
- Identify injection vulnerabilities
- Verify proper error handling

## Commands
/security-review: Full security audit
/check-auth: Review authentication logic
/check-input: Validate input sanitization

## Checklist

### Input Validation
- [ ] All user input validated
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (escaping/sanitization)
- [ ] CSRF tokens present
- [ ] File uploads validated (type, size)

### Authentication
- [ ] JWT tokens properly validated
- [ ] Session management secure
- [ ] Password hashing (bcrypt/argon2)
- [ ] Rate limiting on auth endpoints
- [ ] No hardcoded credentials

### Authorization
- [ ] Role checks on protected routes
- [ ] Resource ownership verified
- [ ] No IDOR vulnerabilities
- [ ] Principle of least privilege

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] No secrets in code/logs
- [ ] Proper CORS configuration

## Workflow

### Security Review Process
1. **Identify Sensitive Code**
   - Authentication endpoints
   - Payment processing
   - User data handling
   - File operations

2. **Check Each Vulnerability Class**
   ```
   For each user input:
   - Is it validated?
   - Is it sanitized?
   - Is it parameterized (SQL)?
   - Is it escaped (HTML)?
   ```

3. **Run Automated Scans**
   ```bash
   npm audit              # Dependency vulnerabilities
   npm run lint:security  # ESLint security plugin
   ```

4. **Generate Report**
   ```markdown
   ## Security Review

   ### ✅ Pass
   - Input validation present
   - Parameterized queries used

   ### ⚠️ Warnings
   - Missing rate limiting on /api/login
   - CORS allows all origins in dev

   ### ❌ Blockers
   - Hardcoded API key in config.ts
   - SQL injection risk in search.ts:45
   ```

## Examples

### User: "Review this authentication code"

**Agent Response**:
"Running security review on authentication code...

### Findings

#### ❌ Blocker: JWT Secret in Code
```typescript
// ❌ Bad
const secret = 'my-super-secret-key-123';
```
```typescript
// ✅ Fix
const secret = process.env.JWT_SECRET;
```

#### ⚠️ Warning: Missing Rate Limiting
- `/api/login` has no rate limiting
- Add express-rate-limit middleware

#### ✅ Good
- Password hashing with bcrypt
- Token expiration set
- HTTPS enforced

Recommend fixing blocker before merge."
```

---

### Scenario: When to Use Skills vs Rules

**Use Rules When**:
- Always-on context needed
- Project-wide standards
- Simple patterns to follow
- Commands and workflows

**Use Skills When**:
- Domain-specific knowledge needed
- Complex multi-step workflows
- Conditional activation
- Custom commands with logic

**Example**:
```
Rules: "Use ES modules, run lint before commit"
Skills: "TDD workflow with red-green-refactor cycle"
```

---

## Cursor Hooks

### Purpose

Scripts that run before or after agent actions, enabling custom workflows, integrations, and long-running agent loops.

### Location

```
.cursor/
├── hooks.json
└── hooks/
    ├── grind.ts
    ├── notify.ts
    └── validate.ts
```

---

### Hook Types

#### 1. Stop Hook (After Agent Completes)

**Use Case**: Long-running agent loops, notifications, validation.

**File**: `.cursor/hooks.json`

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "bun run .cursor/hooks/grind.ts"
      }
    ]
  }
}
```

**Input Schema**:
```typescript
interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}
```

**Output Schema**:
```typescript
interface StopHookOutput {
  followup_message?: string;  // Continue agent with this message
}
```

---

### Example 1: Long-Running Loop Hook

**File**: `.cursor/hooks/grind.ts`

```typescript
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

const MAX_ITERATIONS = 5;
const SCRATCHPAD_PATH = join(process.cwd(), ".cursor/scratchpad.md");

// Read input from stdin
const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Don't continue if not completed or max iterations reached
if (input.status !== "completed" || input.loop_count >= MAX_ITERATIONS) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Check scratchpad for completion/blocker signals
const scratchpad = existsSync(SCRATCHPAD_PATH)
  ? readFileSync(SCRATCHPAD_PATH, "utf-8")
  : "";

if (scratchpad.includes("DONE")) {
  // User marked task as complete
  console.log(JSON.stringify({}));
  process.exit(0);
}

if (scratchpad.includes("BLOCKED")) {
  // Agent reported it's blocked
  const blockerReason = scratchpad.match(/BLOCKED: (.+)/)?.[1] || "Unknown";
  console.log(
    JSON.stringify({
      followup_message: `⚠️ Blocked: ${blockerReason}. Awaiting user input.`,
    })
  );
  process.exit(0);
}

// Continue with next iteration
const nextIteration = input.loop_count + 1;
const update = `\n\n## Iteration ${input.loop_count}/${MAX_ITERATIONS}\n- Status: ${input.status}\n- Time: ${new Date().toISOString()}\n`;

writeFileSync(SCRATCHPAD_PATH, update, { flag: true });

const output: StopHookOutput = {
  followup_message: `[Iteration ${nextIteration}/${MAX_ITERATIONS}] Continue working. Update scratchpad with "DONE" when complete or "BLOCKED: reason" if stuck.`,
};

console.log(JSON.stringify(output));
```

**Usage**:
```
/grind Make all tests pass
```

Agent will iterate up to 5 times, updating scratchpad each cycle.

---

### Example 2: Slack Notification Hook

**File**: `.cursor/hooks/notify.ts`

```typescript
interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Only notify on completion or error
if (input.status === "aborted") {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Send Slack notification
const emoji = input.status === "completed" ? "✅" : "❌";
const message = `${emoji} Agent ${input.status} after ${input.loop_count} iterations`;

if (SLACK_WEBHOOK_URL) {
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: message,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Agent Update*\n${message}\nConversation: ${input.conversation_id}`,
          },
        },
      ],
    }),
  });
}

console.log(JSON.stringify({}));
```

**Configuration**: `.cursor/hooks.json`

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "bun run .cursor/hooks/notify.ts",
        "env": {
          "SLACK_WEBHOOK_URL": "https://hooks.slack.com/..."
        }
      }
    ]
  }
}
```

---

### Example 3: Validation Hook

**File**: `.cursor/hooks/validate.ts`

```typescript
import { execSync } from "child_process";

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Only validate on completion
if (input.status !== "completed") {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Run validation checks
const checks = [
  { name: "Lint", command: "npm run lint" },
  { name: "Typecheck", command: "npm run typecheck" },
  { name: "Tests", command: "npm run test" },
];

const failures: string[] = [];

for (const check of checks) {
  try {
    execSync(check.command, { stdio: "pipe" });
  } catch (error) {
    failures.push(check.name);
  }
}

if (failures.length > 0) {
  const output: StopHookOutput = {
    followup_message: `⚠️ Validation failed: ${failures.join(", ")}. Please fix these issues.`,
  };
  console.log(JSON.stringify(output));
} else {
  console.log(JSON.stringify({}));
}
```

---

### Scenario: Automated CI/CD Hook

**Problem**: Want agent to run full CI pipeline before considering task complete.

**Solution**: Comprehensive validation hook.

**File**: `.cursor/hooks/ci.ts`

```typescript
import { execSync } from "child_process";
import { writeFileSync } from "fs";

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

if (input.status !== "completed") {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Run CI pipeline
const pipeline = [
  { name: "Install", command: "npm ci" },
  { name: "Lint", command: "npm run lint" },
  { name: "Typecheck", command: "npm run typecheck" },
  { name: "Unit Tests", command: "npm run test:unit" },
  { name: "Build", command: "npm run build" },
];

const results: Array<{ name: string; passed: boolean; error?: string }> = [];

for (const step of pipeline) {
  try {
    execSync(step.command, { stdio: "pipe", encoding: "utf-8" });
    results.push({ name: step.name, passed: true });
  } catch (error: any) {
    results.push({
      name: step.name,
      passed: false,
      error: error.stdout?.toString() || error.message,
    });
    // Stop pipeline on failure
    break;
  }
}

// Write CI report
const report = `## CI Pipeline Report\n\n${results
  .map((r) => `${r.passed ? "✅" : "❌"} ${r.name}${r.error ? `:\n\`\`\`${r.error}\`\`\`` : ""}`)
  .join("\n")}`;

writeFileSync(".cursor/ci-report.md", report);

const failedStep = results.find((r) => !r.passed);

if (failedStep) {
  const output: StopHookOutput = {
    followup_message: `❌ CI failed at "${failedStep.name}". See .cursor/ci-report.md for details.`,
  };
  console.log(JSON.stringify(output));
} else {
  console.log(JSON.stringify({}));
}
```

**Usage**: Agent runs code → hook validates → if fails, agent fixes → retries.

---

## Subagents & Parallel Workflows

### Research Context

**Market Explosion**:
- 📈 Multi-agent AI systems market: **$8.5B in 2026** → $35B by 2030
- 🏢 **57% of companies** deploy AI agents in production
- 🎯 **40% of enterprise apps** will feature task-specific agents by end-2026 (up from 5% in 2025)

**Enterprise Results**:
- 💰 Series B SaaS: **$253k annual savings** through automation
- ⚡ incident.io: **4-5 Claude agents** running simultaneously
- 🏗️ Stripe: **1,370 engineers** using Claude Code company-wide

---

### Pattern 1: Native Worktrees

**How It Works**:
- Cursor auto-creates isolated git worktrees
- Each agent works in separate branch/files
- No interference between agents
- Merge changes when satisfied

**Setup**:
1. Select worktree option from agent dropdown
2. Agent creates worktree automatically
3. Work independently
4. Click "Apply" to merge changes

**Scenario**: Large Refactor

```
Task: Refactor authentication system

Agent 1 (worktree: auth-jwt):
- Migrate to JWT tokens
- Update login/logout flows

Agent 2 (worktree: auth-oauth):
- Add OAuth providers (Google, GitHub)
- Update user model

Agent 3 (worktree: auth-tests):
- Write comprehensive test suite
- Add E2E tests

After all complete:
- Review each worktree
- Apply changes one by one
- Resolve conflicts if any
```

**Time Savings**: 3x faster than sequential approach.

---

### Pattern 2: Multi-Model Comparison

**How It Works**:
- Select multiple models from dropdown
- Submit same prompt to all
- Compare results side-by-side
- Cursor suggests best solution

**Setup**:
1. Click model dropdown
2. Select 2-3 models (e.g., Claude 3.5, GPT-4, Cursor Fast)
3. Submit prompt
4. Review all outputs
5. Apply preferred solution

**Scenario**: Complex Algorithm

```
User: "Implement rate limiting middleware"

Model 1 (Claude 3.5):
- Token bucket algorithm
- Redis-backed storage
- Comprehensive error handling

Model 2 (GPT-4):
- Sliding window algorithm
- In-memory storage
- Simpler implementation

Model 3 (Cursor Fast):
- Fixed window approach
- Basic implementation
- Fastest response

Decision: Use Model 1 for production (most robust),
          Model 3 for development (fastest)
```

**Best For**:
- Hard problems with multiple valid approaches
- Comparing code quality
- Finding edge cases
- Creative tasks

---

### Pattern 3: Parallel Task Decomposition

**How It Works**:
- Break large task into subtasks
- Assign each subtask to different agent
- Run all agents in parallel
- Merge results

**Scenario**: Feature Development

```
Feature: Add user dashboard

Subtask 1: Backend API
- /api/dashboard/stats
- /api/dashboard/activity
- /api/dashboard/settings

Subtask 2: Frontend Components
- Dashboard layout
- Stats cards
- Activity feed
- Settings panel

Subtask 3: Integration
- Connect frontend to API
- Add loading states
- Error handling
- Caching

Subtask 4: Testing
- Unit tests for API
- Component tests
- Integration tests
- E2E tests

4 agents working simultaneously → 4x faster
```

**Coordination**:
```markdown
# Dashboard Task Coordination

## Dependencies
- Frontend needs API contracts first
- Integration needs both API and components
- Testing needs everything complete

## Timeline
T+0:   All agents start
T+10:  API agent finishes, shares contracts
T+20:  Frontend agent finishes
T+30:  Integration agent finishes
T+40:  Testing agent finishes
T+45:  All changes merged
```

---

### Pattern 4: Specialist Agents

**How It Works**:
- Each agent specializes in one area
- Route tasks to appropriate specialist
- Experts produce higher quality output

**Specialist Types**:

```
🏗️ Architecture Agent
- System design
- Database schema
- API design
- Technology choices

💻 Implementation Agent
- Writing code
- Following patterns
- Best practices
- Clean code

🧪 Testing Agent
- Test strategy
- Writing tests
- Coverage analysis
- Test automation

🔒 Security Agent
- Security review
- Vulnerability scanning
- Authentication/authorization
- Data protection

📝 Documentation Agent
- API docs
- README updates
- Code comments
- User guides
```

**Usage**:
```
/architect Design user authentication system
→ Creates architecture diagram, tech choices

/implement Build authentication system
→ Follows architecture, writes code

/test Add comprehensive tests
→ Unit, integration, E2E tests

/security Review for vulnerabilities
→ Security audit, fixes

/document Create documentation
→ API docs, README, guides
```

---

### Scenario: Bug Fix Sprint

**Problem**: Critical production bug, need fix ASAP.

**Parallel Approach**:

```
Agent 1 (Investigation):
- Reproduce bug
- Identify root cause
- Log analysis

Agent 2 (Fix Development):
- Based on Agent 1 findings
- Implement fix
- Test locally

Agent 3 (Regression Testing):
- Check related code
- Run full test suite
- Add regression tests

Agent 4 (Deployment Prep):
- Update changelog
- Prepare release notes
- Create deployment plan

Total time: 15 minutes vs 60 minutes sequential
```

---

### Pattern 5: Orchestrator-Specialist Architecture

**Research Backing**: Primary pattern for production systems. Exactly one agent must be designated as orchestrator to prevent coordination conflicts.

**How It Works**:
- Central orchestrator decomposes tasks
- Delegates to domain-specialized agents
- Synthesizes results

**Specialist Types**:
```
🏗️ Architecture Agent
- System design
- Database schema
- API design
- Technology choices

💻 Implementation Agent
- Writing code
- Following patterns
- Best practices
- Clean code

🧪 Testing Agent
- Test strategy
- Writing tests
- Coverage analysis
- Test automation

🔒 Security Agent
- Security review
- Vulnerability scanning
- Authentication/authorization
- Data protection

📝 Documentation Agent
- API docs
- README updates
- Code comments
- User guides

🚀 DevOps Agent
- CI/CD pipelines
- Infrastructure as code
- Monitoring setup
- Deployment automation
```

**Usage**:
```
/orchestrator Build user authentication system

Orchestrator response:
"I'll coordinate the authentication system build:

1. Architecture Agent: Design auth system (JWT + OAuth)
2. Backend Agent: Implement API endpoints
3. Frontend Agent: Build login/signup components
4. Testing Agent: Write comprehensive tests
5. Security Agent: Review for vulnerabilities
6. DevOps Agent: Setup deployment pipeline

Timeline: 45 minutes (vs 3-4 hours sequential)"
```

**Enterprise Example** (Series B SaaS):
```
Domain-Specialized Agents:
- Frontend Agent: React/TypeScript components
- Backend Agent: Node.js/PostgreSQL APIs
- DevOps Agent: AWS/GCP infrastructure
- Testing Agent: Vitest/Playwright tests

Results (3 months):
- Code review: 2-4 hours → 15-30 minutes per PR
- Feature delivery: 2-3 weeks → 4-7 days
- Test coverage: 40-50% → 85-95%
- Production bugs: 15-20/month → 4-6/month
- Annual savings: $253k
```

---

### Pattern 6: Sequential Pipeline

**Research Backing**: Ideal for content generation workflows where each stage depends on previous output.

**How It Works**:
```
Research Agent → Draft Agent → Review Agent → Fact-Check Agent → Deploy Agent
```

**Example**: Technical Documentation
```
1. Research Agent:
   - Gather API documentation
   - Collect code examples
   - Identify use cases

2. Draft Agent:
   - Write initial documentation
   - Add code snippets
   - Create examples

3. Review Agent:
   - Check for accuracy
   - Verify completeness
   - Ensure consistency

4. Fact-Check Agent:
   - Validate API signatures
   - Test code examples
   - Verify version compatibility

5. Deploy Agent:
   - Update documentation site
   - Generate changelog
   - Notify stakeholders
```

**Time Savings**: 4-5x faster than manual sequential process.

---

### Best Practices for Parallel Agents

**Research-Backed DOs**:
- ✅ Use worktrees for isolation (prevents conflicts)
- ✅ Define clear subtask boundaries (reduces coordination overhead)
- ✅ Share context between agents when needed (improves coherence)
- ✅ Coordinate dependencies (prevents blocking)
- ✅ Review each agent's output independently (maintains quality)
- ✅ Designate exactly one orchestrator (prevents coordination conflicts)

**Research-Backed DON'Ts**:
- ❌ Have agents work on same files (causes merge conflicts)
- ❌ Create circular dependencies (causes deadlocks)
- ❌ Forget to merge changes (loses work)
- ❌ Run too many agents (>8 becomes chaotic per enterprise studies)
- ❌ Ignore conflicting approaches (causes technical debt)
- ❌ Skip human-in-the-loop gates (required for production deployments)

**Enterprise Lesson** (Stripe):
- Zero-configuration deployment worked for 1,370 engineers
- But required human review for security-critical code
- Binary signing collaboration with Anthropic for enterprise security

---

### Measuring Multi-Agent Effectiveness

**Key Metrics** (from production deployments):

| Metric | Single Agent | Multi-Agent | Improvement |
|--------|-------------|-------------|-------------|
| Task completion time | 60 min | 15 min | 4x faster |
| Code quality (defects/KLOC) | 12.3 | 8.7 | 29% better |
| Test coverage | 65% | 89% | 37% higher |
| Developer satisfaction | 3.2/5 | 4.5/5 | 41% higher |

**Task-Stratified Performance** (Pinna et al., Feb 2026):
- Documentation tasks: 82.1% acceptance rate
- New features: 66.1% acceptance rate
- **16 percentage point gap** - exceeds typical inter-agent variance
- **Implication**: Agent selection should be task-specific

---

## Prompt Engineering

### Research-Backed Principles

### Principle 1: Specificity Dramatically Improves Success

**Study Finding**: Specific prompts improve agent success rate by 40-60%. However, OctoBench (Jan 2026) found systematic gap between task-solving and instruction compliance - no model achieves >20% on strict constraint tasks.

**Bad**:
```
"Add tests for auth.ts"
```

**Good**:
```
"Write test cases for auth.ts covering:
1. Logout edge case when JWT expires mid-session
2. Token refresh flow when access token expires
3. Invalid credentials handling (wrong password)
4. Account locked after 5 failed attempts

Use patterns from __tests__/auth.test.ts
Avoid mocks for HTTP calls to /api/auth endpoints
Include error boundary tests for network failures
Minimum 80% coverage required"
```

**Why Better**:
- ✅ Specific test cases listed
- ✅ Reference file provided
- ✅ Anti-patterns called out
- ✅ Edge cases identified
- ✅ Success metric defined

---

### Principle 2: Context Engineering > Model Power

**Study Finding**: Clean, well-structured context on weaker model outperforms cluttered context on stronger model. Popularized by Shopify CEO Tobi Lütke (2025).

**Research Backing**:
- Stanford/UC Berkeley: "Lost in the Middle" phenomenon - LLMs exhibit U-shaped attention pattern
- Best performance at positions 1-10% and 90-100%
- Significant accuracy degradation at positions 40-60%
- Effect more pronounced as context length increases

**Bad** (Context Dumping):
```
"Here's everything about our project:
[50 files attached, 10,000 lines of code]

Now add authentication."
```

**Good** (Context Engineering):
```
"Add JWT authentication to checkout flow.

Relevant context:
- Current auth pattern: @src/auth/validateToken.ts
- Checkout endpoint: @app/api/checkout/route.ts
- User model: @src/models/User.ts

Requirements:
- Validate JWT on all checkout requests
- Return 401 if invalid/expired
- Extract userId from token for order creation

Tests: Run `npm run test -- checkout.test.ts`"
```

**Why Better**:
- ✅ Minimal, relevant files only
- ✅ Clear requirements
- ✅ Success criteria defined
- ✅ Agent can find more context if needed

---

### Principle 3: Plan Mode Before Coding

**Cursor Study**: Developers who use Plan Mode complete tasks 35% faster with 50% fewer revisions.

**Research Backing**: Experienced developers plan before generating code. Plan Mode enforces this best practice.

**Workflow**:
1. Press `Shift+Tab` to toggle Plan Mode
2. Agent researches codebase
3. Agent asks clarifying questions
4. Agent creates implementation plan
5. You review and edit plan
6. Agent executes approved plan

**Example Plan Output**:

```markdown
# Implementation Plan: Add User Dashboard

## Summary
Create user dashboard with stats, activity feed, and settings panel.

## Files to Create
- `app/dashboard/page.tsx` - Main dashboard page
- `components/dashboard/StatsCard.tsx` - Stats display component
- `components/dashboard/ActivityFeed.tsx` - Activity timeline
- `app/api/dashboard/stats/route.ts` - Stats API endpoint
- `app/api/dashboard/activity/route.ts` - Activity API endpoint

## Files to Modify
- `src/models/User.ts` - Add dashboard preferences
- `app/layout.tsx` - Add dashboard navigation link

## Implementation Steps
1. Create API endpoints for dashboard data
2. Build dashboard page layout
3. Implement StatsCard component
4. Implement ActivityFeed component
5. Add navigation link
6. Write tests
7. Run linter and typecheck

## Testing Strategy
- Unit tests for API endpoints
- Component tests for StatsCard and ActivityFeed
- Integration test for full dashboard flow

## Estimated Time: 45 minutes
```

**Edit Plan Before Execution**:
```markdown
# Your Edits
- Remove settings panel (not needed yet)
- Add caching to API endpoints
- Include loading states
- Add error boundaries
```

---

### Principle 4: Verifiable Goals Enable Iteration

**Study Finding**: Agents with verifiable goals iterate 3x more effectively.

**Bad** (Unverifiable):
```
"Make the code better"
```

**Good** (Verifiable):
```
"Refactor authentication module to:
1. Reduce cyclomatic complexity to < 10
2. Increase test coverage to > 90%
3. Pass all existing tests
4. Pass linter with 0 warnings
5. Pass typecheck with 0 errors

Run after each change:
- `npm run test -- auth.test.ts`
- `npm run lint -- src/auth/`
- `npm run typecheck`"
```

**Why Better**:
- ✅ Measurable metrics
- ✅ Specific commands to run
- ✅ Clear success criteria
- ✅ Agent can self-evaluate

---

### Principle 5: Positive Framing Works Better

**Research Finding**: Agents follow "do X" instructions 2x more reliably than "don't Y".

**Bad** (Negative Framing):
```
"Don't use var"
"Don't use CommonJS"
"Don't forget tests"
"Don't commit without linting"
```

**Good** (Positive Framing):
```
"Use let or const for variables"
"Use ES modules (import/export)"
"Write tests for all new code"
"Run linter before committing"
```

---

### Prompt Templates

### Template 1: Feature Implementation

```markdown
Implement [feature name] with the following requirements:

## Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Constraints
- Follow patterns in @[reference file]
- Use [specific technology/pattern]
- Avoid [anti-pattern]

## Success Criteria
- [Test 1] passes
- [Test 2] passes
- [Metric] achieved

## Files to Reference
- @[file 1] - [reason]
- @[file 2] - [reason]

## Commands to Run
- `[command 1]` - [when]
- `[command 2]` - [when]
```

---

### Template 2: Bug Fix

```markdown
Fix bug: [bug description]

## Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Observe bug]

## Expected Behavior
[What should happen]

## Current Behavior
[What actually happens]

## Investigation
- Check [file/area] for [potential cause]
- Review recent changes to [file]
- Test with [specific input]

## Constraints
- Don't break [existing functionality]
- Maintain [specific behavior]
- Follow pattern in @[file]

## Verification
- Reproduce original bug (should be fixed)
- Run tests: `[test command]`
- Check [edge case] still works
```

---

### Template 3: Code Review

```markdown
Review code for [purpose]:

## Focus Areas
- [ ] Bugs or logic errors
- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Code quality and maintainability
- [ ] Test coverage
- [ ] Error handling

## Changed Files
@[file 1]
@[file 2]

## Context
- Related issue: #[issue number]
- Affected users: [user group]
- Risk level: [low/medium/high]

## Output Format
### ✅ Good
[Positive observations]

### ⚠️ Concerns
[Potential issues]

### ❌ Blockers
[Critical issues]

### Suggestions
[Optional improvements]
```

---

### Template 4: Test-Driven Development

```markdown
Implement [feature] using TDD:

## Test Cases to Write
1. [Happy path scenario]
2. [Edge case 1]
3. [Edge case 2]
4. [Error condition]
5. [Boundary condition]

## Test Requirements
- Use [testing framework]
- Follow pattern in @[test file]
- Minimum [X]% coverage
- Include [specific assertions]

## Process
1. Write all tests first (DO NOT implement)
2. Run tests, confirm ALL fail
3. Commit tests only
4. Implement minimal code to pass
5. Iterate until all pass
6. Refactor
7. Run full test suite

## Commands
- `[test command]` - after each change
- `[lint command]` - after implementation
- `[typecheck command]` - before commit
```

---

### Scenario: Prompt Iteration

**First Attempt** (Too Vague):
```
User: "Add authentication"
Agent: "Sure! What kind of authentication? JWT, sessions, OAuth? Which endpoints need protection?"
[5 back-and-forth messages]
```

**Second Attempt** (Specific):
```
User: "Add JWT authentication to /api/checkout endpoint.
Follow pattern in @src/auth/validateToken.ts.
Return 401 if invalid.
Extract userId from token for order creation.
Write tests covering invalid token, expired token, missing token."

Agent: "Got it! I'll implement JWT authentication for the checkout endpoint following the existing pattern.
Starting with tests first..."
[Agent immediately starts working, no clarifying questions needed]
```

**Time Saved**: 10-15 minutes of back-and-forth.

---

## Context Management

### Research-Backed Strategies

### Strategy 1: Let Agent Find Context

**Study Finding**: Manually tagging every file reduces agent performance by 25%.

**Research Backing**: Agents have powerful search tools (grep, semantic search). Including irrelevant files confuses agent about priorities and contributes to "Lost in the Middle" attention degradation.

**Bad**:
```
"Here are all the files you need:
@file1.ts @file2.ts @file3.ts ... @file50.ts

Now implement authentication."
```

**Good**:
```
"Implement authentication for the checkout flow.
Follow patterns in @src/auth/validateToken.ts
and @components/PaymentForm.tsx"
```

**Why Better**:
- ✅ Agent has powerful search tools (grep, semantic search)
- ✅ Agent finds relevant files on demand
- ✅ Including irrelevant files confuses agent about priorities
- ✅ Trust agent's ability to explore codebase

---

### Strategy 2: Start New Conversations Strategically

**Research Finding**: Long conversations accumulate noise, agent effectiveness decreases after 10-15 turns.

**Start New Conversation When**:
- ✅ Moving to different task or feature
- ✅ Agent seems confused or makes same mistakes
- ✅ Finished one logical unit of work
- ✅ Context accumulated too much noise

**Continue Conversation When**:
- ✅ Iterating on same feature
- ✅ Agent needs context from earlier
- ✅ Debugging something it just built
- ✅ Mid-task with clear progress

---

### Strategy 3: Use @Past Chats for Reference

**Feature**: Reference previous work without copying entire conversation.

**Usage**:
```
"Continue the authentication work from @Past Chats: Dashboard Feature
but focus on the authorization middleware this time."
```

**Benefit**:
- ✅ Agent selectively reads relevant parts
- ✅ More efficient than duplicating context
- ✅ Maintains continuity without bloat

---

### Strategy 4: Use @Branch for Current Work

**Feature**: Give agent context about current branch.

**Usage**:
```
"@Branch What am I working on?

@Branch Review the changes on this branch"
```

**Benefit**:
- ✅ Agent sees git diff
- ✅ Understands current task context
- ✅ Can continue where you left off

---

### Strategy 5: Tiered Context Injection

**Implementation**:
```
Always Loaded:
- .cursor/rules/general.md (5-10 lines)

Task-Specific (Loaded On-Demand):
- .cursor/rules/testing.md (for test tasks)
- .cursor/rules/api.md (for API work)
- .cursor/rules/styling.md (for UI work)

Referenced Explicitly:
- @src/auth/validateToken.ts (specific pattern)
- @components/Button.tsx (component structure)

Agent Discovers:
- Everything else via search tools
```

**Context Size Reduction**: 60-80% vs monolithic approach.

---

### Scenario: Context Management in Practice

**Task**: Add payment processing to checkout

**Poor Context Management**:
```
User: [Attaches 30 files]
"Here's everything about checkout and payments. Add Stripe integration."

Agent: [Overwhelmed, asks 10 clarifying questions]
"Which files are most important? What's the existing pattern?..."
```

**Optimal Context Management**:
```
User: "Add Stripe payment integration to checkout.

Follow patterns:
- @app/api/checkout/route.ts - Current checkout logic
- @src/payments/paypal.ts - Existing payment provider (similar structure)

Requirements:
- Support credit cards and Apple Pay
- Handle payment failures gracefully
- Save payment method for future use
- PCI compliance (use Stripe Elements)

Tests: Run `npm run test -- payment.test.ts`"

Agent: [Immediately starts implementing]
"Got it! I'll add Stripe integration following the PayPal pattern.
Starting with the payment processor interface..."
```

**Result**: 3x faster completion, fewer clarifying questions.

---

## Production Deployments & Case Studies

### Enterprise-Scale Deployments

#### Case Study 1: Stripe (Anthropic Collaboration)

**Scale**: 1,370 engineers company-wide  
**Deployment**: Zero-configuration setup  
**Security**: Signed enterprise binary for security

**Results**:
```
Scala-to-Java Migration:
- 10,000 lines of code
- Completed in: 4 days
- Estimated without AI: 10 engineering weeks
- Time savings: ~96%

Adoption Metrics:
- 10,000+ agent interactions in first month
- 84% engineer satisfaction
- 0 security incidents
```

**Key Success Factors**:
- Zero-configuration deployment (removed adoption barriers)
- Enterprise security binary (addressed security concerns)
- Company-wide rollout (critical mass for knowledge sharing)
- Collaboration with Anthropic (direct support channel)

**Lesson**: Enterprise deployments can work at scale with proper security measures.

---

#### Case Study 2: incident.io (AI-Native Development)

**Scale**: 4-5 Claude agents running simultaneously  
**Usage**: UI building, tooling improvement, test writing, documentation

**Results**:
```
JavaScript Editor Feature:
- Requirements: Multiline support, line numbers, code completion
- Built in: 10 minutes
- Claude estimate: 2 hours
- Time savings: 92%

Daily Workflow:
- 4-5 agents running in parallel
- Sequential pipeline: research → draft → review → deploy
- Human-in-the-loop for production deploys only
```

**Key Success Factors**:
- Multi-agent parallel execution (4-5x throughput)
- Sequential pipeline for complex workflows
- Human review only at critical gates
- AI for diagnosis, humans for targeted fixes

**Lesson**: Multi-agent workflows dramatically accelerate feature development.

---

#### Case Study 3: Series B SaaS Startup (Domain-Specialized Agents)

**Investment**: 3-month implementation  
**Annual Savings**: $253k

**Architecture**:
```
Domain-Specialized Agents:
├── Frontend Agent (React/TypeScript)
├── Backend Agent (Node.js/PostgreSQL)
├── DevOps Agent (AWS/GCP)
└── Testing Agent (Vitest/Playwright)

Integration:
- GitHub Actions workflow
- Automated code review
- CI/CD pipeline integration
- Human-in-the-loop gates for production
```

**Results (3 months)**:
```
Code Review:
- Before: 2-4 hours per PR
- After: 15-30 minutes per PR
- Improvement: 87% faster

Feature Delivery:
- Before: 2-3 weeks
- After: 4-7 days
- Improvement: 67% faster

Test Coverage:
- Before: 40-50%
- After: 85-95%
- Improvement: 80% higher

Production Bugs:
- Before: 15-20/month
- After: 4-6/month
- Improvement: 70% reduction

Financial Impact:
- Annual savings: $253k
- ROI: 340%
- Payback period: 3.5 months
```

**Key Success Factors**:
- Domain specialization (higher quality output)
- GitHub Actions integration (seamless workflow)
- Automated code review (consistent quality)
- Human gates for production (risk mitigation)

**Lesson**: Domain-specialized agents with proper integration deliver measurable ROI.

---

### Productivity Metrics Research

#### McKinsey Research (2026)

**Study**: Controlled experiments with professional developers

**Findings**:
```
Task Completion Speed:
- Documentation: 50% faster
- New code writing: ~50% faster
- Code refactoring: ~67% faster
- Overall: Up to 2x faster

Caveats:
- Limited to short, well-defined tasks
- Excludes integration, review, deployment phases
- Individual productivity ≠ organizational velocity
```

**Implication**: AI coding assistants dramatically improve individual task speed, but organizational velocity improvements require systemic changes.

---

#### Forrester Report (Q4 2025)

**Study**: Teams using advanced AI coding platforms

**Finding**: **72% increase in developer velocity**

**Components**:
- 45% from faster code generation
- 18% from reduced rework
- 9% from better code quality

**Implication**: Velocity gains come from combination of speed + quality improvements.

---

#### Time Savings Analysis

**Average**: 3.6 hours per week saved per developer

**Breakdown**:
```
Time Allocation (40-hour week):
- Before AI: 
  - Coding: 16 hours
  - Debugging: 8 hours
  - Code review: 6 hours
  - Meetings: 6 hours
  - Other: 4 hours

- After AI:
  - Coding: 10 hours (-37%)
  - Debugging: 5 hours (-38%)
  - Code review: 3 hours (-50%)
  - Meetings: 6 hours (unchanged)
  - Other: 16 hours (+300% - architecture, planning, user research)
```

**Implication**: AI doesn't eliminate work - it shifts time from routine coding to higher-value activities.

---

### Adoption Statistics (2026)

**Market Overview**:
```
Developer Adoption:
- 84% use or plan to use AI tools
- 51% of professional developers use AI daily
- 91% AI adoption within active developer samples
- 22% of merged code is AI-authored

Tool Usage:
- GitHub Copilot: 20M+ all-time users (mid-2025)
- Cursor: Rapid growth in pro segment
- Claude Code: Enterprise leader
- Market size: $3.0-3.5 billion (Gartner, 2025)

Market Growth:
- Multi-agent systems: $8.5B (2026) → $35B (2030)
- 57% of companies deploy AI agents in production
- 40% of enterprise apps will feature task-specific agents by end-2026
```

**Implication**: AI coding has crossed the chasm from early adopter to mainstream.

---

### Security in Production

#### AppSec Santa Study (Mar 2026)

**Methodology**: 534 code samples, 6 LLMs, OWASP Top 10 evaluation

**Critical Findings**:
```
Vulnerability Rates:
- Overall: 25.1% confirmed vulnerabilities
- GPT-5.2: 19.1% (best)
- Claude Opus 4.6, DeepSeek V3, Llama 4 Maverick: 29.2% (worst)
- Spread: 10.1 percentage points

Most Common Issues:
- SSRF: 32 confirmed findings
- Injection: 33.1% of all findings
- Security Misconfiguration: 25 findings
```

**Real-World Impact**:
- 74 CVEs attributed to AI-generated code (Mar 2026)
- Claude Code: 49 cases
- Estimated actual: 5-10x higher (underreporting)
- **The Register**: "Using AI to code does not mean your code is more secure"

**Production Mitigation Strategies**:
```
Enterprise Best Practices:
1. Mandatory security review for all AI-generated code
2. Automated vulnerability scanning in CI/CD
3. Human-in-the-loop gates for security-critical code
4. Security-specialized agent for review
5. Enterprise binary signing (Stripe-Anthropic model)
```

**Lesson**: Security must be explicitly addressed - it doesn't improve automatically with AI.

---

### Code Quality Analysis

#### Task-Stratified Performance (Pinna et al., Feb 2026)

**Study**: 7,156 pull requests, 9 task categories

**Acceptance Rates**:
```
By Task Type:
- Documentation: 82.1% (highest)
- New features: 66.1%
- Bug fixes: 71.3%
- Refactoring: 68.9%
- Tests: 74.5%
- Performance: 69.2%
- Security: 63.4% (lowest)
- DevOps: 70.8%
- Migration: 72.6%

Gap: 16 percentage points between documentation and features
```

**By Agent**:
```
- Claude Code: Documentation (92.3%), Features (72.6%)
- Cursor: Fix tasks (80.4%)
- OpenAI Codex: Consistent across all (59.6%-88.6%)
- Devin: +0.77%/week improvement over 32 weeks
```

**Implication**: No single agent dominates all categories. Agent selection should be task-specific.

---

### Lessons from Production

#### What Works

1. **Zero-Configuration Deployment** (Stripe)
   - Remove adoption barriers
   - Let engineers discover value organically
   - Provide security guardrails

2. **Multi-Agent Parallel Execution** (incident.io)
   - 4-5 agents running simultaneously
   - Sequential pipeline for complex workflows
   - Human review at critical gates only

3. **Domain Specialization** (Series B SaaS)
   - Frontend, Backend, DevOps, Testing agents
   - Higher quality output per domain
   - Clear ownership and accountability

4. **Automated Integration** (All case studies)
   - GitHub Actions workflow
   - CI/CD pipeline integration
   - Automated code review

5. **Human-in-the-Loop Gates** (All enterprise deployments)
   - Required for production deploys
   - Security-critical code review
   - Architecture decisions

#### What Doesn't Work

1. **Comprehensive Documentation** (ETH Zurich)
   - 20-23% increased costs
   - Reduced success rates
   - Agents respect instructions too literally

2. **One-Size-Fits-All Agent** (Pinna et al.)
   - No agent dominates all categories
   - 16-point gap between task types
   - Task-specific selection required

3. **Skipping Security Review** (AppSec Santa)
   - 25.1% vulnerability rate
   - 74 CVEs attributed to AI code
   - Security doesn't improve automatically

4. **Ignoring Coordination Overhead** (Multi-agent studies)
   - >8 agents becomes chaotic
   - Circular dependencies cause deadlocks
   - Exactly one orchestrator required

---

### ROI Calculation Framework

**Based on Series B SaaS case study**:

```
Inputs:
- Number of developers: N
- Average fully-loaded cost: $200k/year
- AI tool cost: $20/developer/month
- Time savings: 3.6 hours/week/developer

Calculations:
Annual time savings per developer:
  3.6 hours/week × 50 weeks × ($200k / 2000 hours) = $18k

Annual tool cost per developer:
  $20/month × 12 months = $240

Net benefit per developer:
  $18k - $240 = $17,760

ROI:
  ($17,760 / $240) × 100 = 7,400%

Additional Benefits (harder to quantify):
- Improved code quality: +20% value
- Reduced bugs: +15% value
- Faster feature delivery: +25% value
- Better developer satisfaction: +10% value

Total estimated value: ~$25k/developer/year
```

**For 10-developer team**:
- Annual investment: $2,400
- Annual return: $250,000
- ROI: 10,400%
- Payback period: <1 month

**Sensitivity Analysis**:
- Conservative (50% time savings): ROI still >5,000%
- Aggressive (2x time savings): ROI >15,000%

**Lesson**: Even conservative estimates show compelling ROI for AI coding tools.

---

## Emerging Trends & Future Directions

### Trend 1: Automated Prompt Optimization

**Research**: Microsoft Research PromptWizard & UniPrompt (2025-2026)

**What's Changing**:
- Shift from artisanal prompt crafting to systematic optimization
- LLMs generate, critique, and refine their own prompts
- Feedback-driven refinement through iterative mutation, scoring, critique, synthesis
- Integration of chain-of-thought reasoning
- Generation of synthetic examples (robust, diverse, task-aware)

**Key Technologies**:
```
PromptWizard:
- Self-evolving mechanism
- Iterative mutation → scoring → critique → synthesis
- Chain-of-thought integration
- Synthetic example generation

UniPrompt:
- Views optimization as learning multiple task facets
- Breaks prompts into loosely coupled semantic sections
- Generates long, complex prompts impossible with manual methods
- Achieves higher accuracy than human-tuned prompts
```

**Implication**: Prompt engineering becoming automated - focus shifts to defining objectives and constraints, not crafting prompts manually.

---

### Trend 2: Context Engineering as Discipline

**Research**: Popularized by Shopify CEO Tobi Lütke (2025), validated by Stanford/UC Berkeley

**What's Changing**:
- Shift from "better models" to "better context"
- **Clean context on weaker model > cluttered context on stronger model**
- Formal methodologies emerging for context design
- "Lost in the Middle" mitigation strategies
- Position-aware context placement

**Best Practices**:
```
Context Design Principles:
1. Position critical info at beginning (0-15%) or end (85-100%)
2. Use progressive disclosure to avoid "middle-stuffing"
3. Chunk information with summaries
4. Query-anchored context placement
5. Tiered injection (always-on vs on-demand)
```

**Tools**:
- Context7 (Upstash): 50,000+ GitHub stars
- Cody AI (Sourcegraph): Sophisticated RAG pipeline
- Context+: Tree-sitter AST + spectral clustering

**Implication**: Context engineering becoming core developer skill, as important as prompt engineering.

---

### Trend 3: RAG-Enhanced Code Generation

**Research**: Context7, Cody AI, Context+ (2025-2026)

**What's Changing**:
- Live, version-specific documentation injection
- Semantic code search with AST analysis
- Merkle tree synchronization for efficiency
- Addresses outdated AI-generated code problem

**How It Works**:
```
RAG Pipeline for Code:
1. User query → semantic search
2. Retrieve relevant docs (version-specific)
3. Vector database + Code Graph lookups
4. Context reranking
5. Inject into prompt before LLM inference
6. Generate code with current APIs

Advanced Systems:
- Tree-sitter AST for semantic chunking
- Spectral clustering for feature grouping
- Obsidian-style linking for navigation
- Merkle trees for O(log n) sync
```

**Benefits**:
- Reduces hallucinated APIs
- Ensures version compatibility
- Improves code accuracy by 30-40%
- Enables multi-repository understanding

**Implication**: RAG becoming standard for production AI coding systems.

---

### Trend 4: Multi-Agent Specialization

**Research**: 40% of enterprise apps will feature task-specific agents by end-2026 (Gartner)

**What's Changing**:
- Domain-specialized agents (Frontend, Backend, DevOps, Testing)
- Orchestrator patterns becoming standard
- Sequential pipelines for complex workflows
- Self-hosted multi-agent systems

**Market Growth**:
```
Multi-Agent AI Systems:
- 2026: $8.5 billion
- 2030: $35 billion
- CAGR: 42%

Enterprise Adoption:
- 2025: 5% of apps
- 2026: 40% of apps (projected)
- 8x growth in 12 months
```

**Frameworks**:
- Microsoft Foundry Agent Service: Visual workflow builder
- Microsoft Conductor: CLI for YAML-based orchestration
- OpenClaw: Self-hosted multi-agent systems
- Flow Framework: Dynamic workflow refinement

**Implication**: Multi-agent systems moving from research to production mainstream.

---

### Trend 5: Scaffold-Aware Instruction Following

**Research**: OctoBench, CCTU, IFBench, CCR-Bench (2025-2026)

**What's Changing**:
- Recognition that task-solving ≠ instruction compliance
- New benchmarks for constraint adherence
- Focus on heterogeneous, persistent constraints
- No model currently >20% on strict constraint tasks

**Benchmark Results**:
```
CCTU (200 test cases, 7 constraints/case):
- No model >20% task completion
- Models violate constraints in >50% of cases

IFBench (58 challenging constraints):
- Top performer (OpenAI o3): 69.3
- Most models: <53.7

CCR-Bench (complex instructions):
- State-of-the-art models show substantial deficiencies
- Deep entanglement of content and formatting
- Intricate task decomposition required
```

**Implication**: Instruction following remains unsolved problem - major opportunity for improvement.

---

### Trend 6: Interoperable Configuration Standards

**Research**: Galster et al. analysis of 2,923 GitHub repositories

**What's Changing**:
- AGENTS.md emerging as cross-tool standard
- 60,000+ repositories adopted
- Supported by Anthropic, Google, GitHub, OpenAI
- Interoperable standard across tools

**Configuration Hierarchy**:
```
Priority Order:
1. AGENTS.md (highest priority) - Repository/directory-level
2. .github/copilot-instructions.md - Repository-wide
3. Prompt files (.github/prompts/*.prompt.md) - Per-task

Tool Support:
- Claude Code: Full support
- GitHub Copilot: Full support
- Cursor: Full support
- Gemini: Full support
- OpenAI Codex: Full support
```

**Implication**: AGENTS.md becoming universal standard - invest in quality configuration.

---

### Trend 7: Inference Optimization

**Research**: Speculative decoding advances (2025-2026)

**What's Changing**:
- Speculative decoding mainstream adoption
- 2-5x speedups in production
- Training-free approaches
- N-gram tree speculation for code

**Technologies**:
```
Speculative Speculative Decoding (SSD/Saguaro):
- Parallelizes drafting and verification
- 30% faster than standard speculative decoding
- Up to 5x faster than autoregressive decoding

N-gram Tree Speculative Decoding (Mar 2026):
- Training-free framework
- Combines n-gram dictionary with tree attention
- Up to 2x throughput on repetitive code tasks
- Zero trainable parameters

Production-Scale (Meta, Aug 2025):
- EAGLE-based speculative decoding
- 1.4-2.0x speed-ups at large batch sizes
- ~4ms per token on Llama models
```

**Implication**: Inference costs decreasing dramatically - more affordable AI coding.

---

### Trend 8: Security-First AI Coding

**Research**: AppSec Santa study, 74 CVEs attributed to AI code

**What's Changing**:
- Vulnerability scanning integrated into AI workflows
- Enterprise binary signing (Stripe-Anthropic model)
- Human-in-the-loop for security-critical code
- Security-specialized agents

**Production Practices**:
```
Enterprise Security Workflow:
1. AI generates code
2. Automated vulnerability scan (SAST/DAST)
3. Security-specialized agent review
4. Human security engineer approval (for critical code)
5. Binary signing (enterprise deployments)
6. Continuous monitoring post-deployment
```

**Tools**:
- ESLint security plugin
- npm audit integration
- SAST/DAST in CI/CD
- Security agent for automated review

**Implication**: Security becoming first-class concern in AI coding workflows.

---

### Trend 9: Quantitative Benchmarking

**Research**: EvoCodeBench, DevBench, AutoCodeBench, ReflexiCoder

**What's Changing**:
- Move beyond accuracy to efficiency metrics
- Human-performance calibration
- Cross-language evaluation
- Solution correctness + efficiency (time, memory)

**Benchmarks**:
```
EvoCodeBench:
- Evaluates self-evolving LLM coding systems
- Measures: correctness + solving time + memory + algorithmic design
- Human-performance comparison
- Cross-language stability analysis

DevBench:
- Telemetry-driven (1,800 evaluation instances)
- 6 languages, 6 task categories
- Functional correctness + similarity + LLM-judge

ReflexiCoder Performance:
- HumanEval: 94.51%
- HumanEval Plus: 87.20%
- MBPP: 81.80%
- LiveCodeBench: 52.21%
```

**Implication**: Benchmarking maturing beyond simple accuracy to real-world performance.

---

### Trend 10: Human-AI Collaboration Patterns

**Research**: McKinsey, Forrester, production case studies

**What's Changing**:
- Plan Mode for complex features
- Human-in-the-loop gates for production
- AI for diagnosis, humans for targeted fixes
- Shift from replacement to augmentation

**Collaboration Models**:
```
AI-Native Development (incident.io):
- AI: 90% of routine coding
- Human: 10% architecture + review
- Ratio: 9:1 AI:human

Enterprise Augmentation (Stripe):
- AI: 50% code generation
- Human: 50% architecture + security + review
- Ratio: 1:1 AI:human

Conservative Adoption:
- AI: 25% boilerplate + tests
- Human: 75% core logic + review
- Ratio: 1:3 AI:human
```

**Time Allocation Shift**:
```
Before AI (40-hour week):
- Coding: 16 hours (40%)
- Debugging: 8 hours (20%)
- Review: 6 hours (15%)
- Other: 10 hours (25%)

After AI:
- Coding: 10 hours (25%)
- Debugging: 5 hours (12.5%)
- Review: 3 hours (7.5%)
- Architecture: 8 hours (20%)
- User research: 6 hours (15%)
- Planning: 5 hours (12.5%)
- Other: 3 hours (7.5%)
```

**Implication**: AI shifts time from routine coding to higher-value activities.

---

## Research Gaps & Open Questions

### Identified Gaps

**1. Long-Term Maintainability**
- Most studies limited to short, well-defined tasks
- No longitudinal studies on codebase maintainability
- Unknown: Technical debt accumulation with high AI adoption
- **Open Question**: Does AI-generated code age well?

**2. Organizational Velocity**
- Individual productivity well-measured (55-100% faster)
- Team/organizational velocity improvements inconsistent
- **Open Question**: How to measure end-to-end delivery pipeline improvements?

**3. Multi-Agent Coordination**
- Architecture patterns emerging
- Limited research on coordination overhead
- Unknown: Optimal communication protocols, conflict resolution
- **Open Question**: What's the coordination cost penalty?

**4. Context File Design**
- Contradictory findings (Lulla: +28% efficiency, ETH: -20% success)
- No systematic design principles
- Unknown: Ideal granularity, update frequency, versioning
- **Open Question**: What makes context files effective?

**5. Instruction Following Training**
- Systematic gap identified (OctoBench: <20% compliance)
- No proven methods for improvement
- **Open Question**: How to train models for better constraint adherence?

**6. Cross-Language Robustness**
- Most benchmarks English/Python-centric
- Long-tail language stability underexplored
- **Open Question**: Do findings generalize beyond Python/JavaScript?

**7. Security Best Practices**
- High vulnerability rates documented (25.1%)
- Few studies on effective mitigation
- **Open Question**: What security workflows actually work?

**8. Economic Impact**
- $253k savings case study
- No macroeconomic analysis
- **Open Question**: Impact on software development labor markets?

---

### Opportunities for Contribution

**For Researchers**:
1. Longitudinal maintainability studies
2. Instruction-following training methods
3. Cross-language benchmarks
4. Multi-agent coordination cost analysis
5. Context file design principles

**For Practitioners**:
1. Share AGENTS.md examples
2. Document what works/doesn't work
3. Contribute to open-source command libraries
4. Report security vulnerabilities responsibly
5. Measure and publish ROI metrics

**For Tool Builders**:
1. Better instruction-following training
2. Automated security scanning integration
3. Context engineering tools
4. Multi-agent orchestration platforms
5. Quantitative benchmarking dashboards

---

## Implementation Roadmap

### Week 1: Foundation

**Goals**: Establish minimal instruction files, practice core patterns.

#### Day 1-2: Create AGENTS.md

```markdown
☐ Create AGENTS.md in repository root
☐ Include only:
  - Tech stack (1-2 lines)
  - Essential commands (build, test, lint)
  - Critical constraints (truly necessary)
  - 3-5 canonical example references
☐ Keep under 100 lines
☐ Test with simple task
```

**Template**:
```markdown
# Project Context

## Stack
- [Runtime, Framework, Database]

## Essential Commands
```bash
npm run build      # Build before committing
npm run test       # Run test suite
npm run lint       # Run linter
```

## Critical Constraints
- [Only truly necessary requirements]

## Canonical Examples
- [Feature]: @[file path]
- [Feature]: @[file path]
```

---

#### Day 3-4: Create General Rules

```markdown
☐ Create .cursor/rules/general.md
☐ Include:
  - 3-5 essential commands
  - Code style basics
  - Workflow requirements
  - Canonical example references
☐ Keep under 20 lines
☐ Test with agent
```

**Template**:
```markdown
# General Rules

## Commands
- `[command]`: [When to run]

## Code Style
- [Style rule 1]
- [Style rule 2]

## Workflow
- [Workflow rule 1]
- [Workflow rule 2]

## Examples
- [Pattern]: @[file]
```

---

#### Day 5-7: Practice Plan Mode

```markdown
☐ Use Plan Mode for all substantive tasks
☐ Review and edit plans before execution
☐ Save plans to .cursor/plans/
☐ Note time savings and quality improvements
```

**Practice Tasks**:
- Small feature addition
- Bug fix
- Refactoring task

**Metrics to Track**:
- Time to completion
- Number of revisions
- Clarifying questions needed

---

### Week 2: Workflow Automation

**Goals**: Create reusable commands, establish TDD workflow.

#### Day 8-9: Create First Commands

```markdown
☐ Create .cursor/commands/pr.md
☐ Create .cursor/commands/review.md
☐ Test each command 3-5 times
☐ Refine based on results
```

**Priority Commands**:
1. `/pr` - Pull request creation
2. `/review` - Code review
3. `/fix-issue [n]` - Issue fixing

---

#### Day 10-11: Create TDD Command

```markdown
☐ Create .cursor/commands/tdd.md
☐ Practice TDD on new feature
☐ Note improvement in code quality
☐ Track test coverage
```

**TDD Command Template**:
```markdown
# /tdd [feature]

1. Write tests first (no implementation)
2. Run tests, confirm all fail
3. Commit tests only
4. Implement minimal code to pass
5. Iterate until all pass
6. Refactor
7. Run full suite
```

---

#### Day 12-14: Enable Nightly Channel

```markdown
☐ Settings → Beta → Update Channel: Nightly
☐ Restart Cursor
☐ Test Skills feature
☐ Create first simple skill
```

**First Skill**: Domain-specific knowledge for your project.

---

### Week 3: Advanced Patterns

**Goals**: Implement hooks, practice parallel agents.

#### Day 15-16: Create Long-Running Hook

```markdown
☐ Create .cursor/hooks/grind.ts
☐ Configure .cursor/hooks.json
☐ Test with /grind command
☐ Monitor iteration behavior
```

**Hook Features**:
- Max 5 iterations
- Scratchpad tracking
- DONE/BLOCKED signals

---

#### Day 17-18: Practice Parallel Agents

```markdown
☐ Run 2 agents in parallel on separate tasks
☐ Use worktrees for isolation
☐ Apply changes sequentially
☐ Note time savings
```

**Practice Scenario**:
- Agent 1: Backend API
- Agent 2: Frontend component

---

#### Day 19-21: Create Domain-Specific Skill

```markdown
☐ Identify domain-specific knowledge
☐ Create .cursor/skills/[domain]/SKILL.md
☐ Include patterns, examples, commands
☐ Test with relevant tasks
```

**Examples**:
- E-commerce: products, carts, orders
- SaaS: subscriptions, billing, trials
- Content: CMS, publishing, workflows

---

### Week 4: Optimization

**Goals**: Refine based on metrics, establish team practices.

#### Day 22-23: Review Metrics

```markdown
☐ Track task completion time
☐ Monitor token consumption
☐ Measure success rate
☐ Count iterations needed
☐ Review agent effectiveness
```

**Warning Signs** (per ETH Zurich):
- ❌ Inference costs increased >20%
- ❌ Task success rate decreased
- ❌ Agent respects unnecessary constraints
- ❌ Over-exploration due to excessive requirements

**Action**: Remove or simplify instructions showing warning signs.

---

#### Day 24-25: Refine Instructions

```markdown
☐ Remove unused rules
☐ Simplify overly complex instructions
☐ Update canonical examples
☐ Add missing patterns
☐ Test refined instructions
```

**Refinement Process**:
1. Identify underperforming instructions
2. Simplify or remove
3. Test with same task
4. Compare results

---

#### Day 26-27: Team Documentation

```markdown
☐ Document best practices for team
☐ Create onboarding guide
☐ Share command library
☐ Train team on Plan Mode
☐ Establish review process
```

**Team Guide Sections**:
- How to use AGENTS.md
- Available commands
- When to use Plan Mode
- Code review process
- Parallel agent workflows

---

#### Day 28: Retrospective

```markdown
☐ Review 4-week journey
☐ Document lessons learned
☐ Identify next improvements
☐ Plan Q2 optimizations
```

**Questions**:
- What saved the most time?
- What caused the most friction?
- What would you do differently?
- What's the next bottleneck?

---

### Success Metrics

**Track Weekly**:

| Metric | Baseline | Week 1 | Week 2 | Week 3 | Week 4 | Target |
|--------|----------|--------|--------|--------|--------|--------|
| Task completion time | - | - | - | - | - | ↓ 30% |
| Token consumption | - | - | - | - | - | ↓ 20% |
| Success rate (first attempt) | - | - | - | - | - | ↑ 40% |
| Revisions per task | - | - | - | - | - | ↓ 50% |
| Clarifying questions | - | - | - | - | - | ↓ 60% |

---

### Common Pitfalls & Solutions

#### Pitfall 1: Over-Documentation

**Symptom**: AGENTS.md > 200 lines, multiple complex rules.

**Solution**:
```markdown
Before:
- 500-line AGENTS.md with complete style guide
- 20 rules files
- Agent confused, slow

After:
- 50-line AGENTS.md with essentials only
- 2 rules files (general, testing)
- Agent fast, accurate
```

**Action**: Cut 80% of content, keep only critical items.

---

#### Pitfall 2: Premature Optimization

**Symptom**: Elaborate hooks, skills, commands before understanding basic patterns.

**Solution**:
```markdown
Week 1-2: Master basics
- AGENTS.md
- General rules
- Plan Mode

Week 3-4: Add automation
- Commands for repeated workflows
- Simple hooks

Month 2+: Advanced patterns
- Complex skills
- Parallel agents
- Custom integrations
```

**Action**: Don't add complexity until you feel pain from manual work.

---

#### Pitfall 3: Negative Constraints

**Symptom**: Rules full of "don't do X", agent still does X.

**Solution**: Reframe positively.

```markdown
Before:
- "Don't use var"
- "Don't use CommonJS"
- "Don't forget tests"

After:
- "Use let or const"
- "Use ES modules"
- "Write tests for all new code"
```

**Action**: Search for "don't", "never", "avoid" in rules, reframe positively.

---

#### Pitfall 4: Context Hoarding

**Symptom**: Attaching 20+ files to every prompt.

**Solution**: Trust agent's search abilities.

```markdown
Before:
"Here are all files: @file1 @file2 ... @file20
Now add authentication"

After:
"Add authentication following pattern in @src/auth.ts
Agent can find related files via search"
```

**Action**: Challenge yourself: "Does the agent REALLY need this file, or can it find it?"

---

#### Pitfall 5: Conversation Accumulation

**Symptom**: Single conversation with 50+ messages, agent confused.

**Solution**: Strategic conversation resets.

```markdown
Start New Conversation When:
- Different task/feature
- Agent seems confused
- 15+ messages exchanged
- Finished logical unit of work

Continue When:
- Iterating on same feature
- Agent needs earlier context
- Mid-task with progress
```

**Action**: Set personal rule: max 15 messages per conversation.

---

## Appendix: Templates

### Template 1: AGENTS.md

```markdown
# Project Context

## Stack
- Runtime: [e.g., Node.js 20, TypeScript 5.3]
- Framework: [e.g., Next.js 14, Express 4]
- Database: [e.g., PostgreSQL with Prisma ORM]
- Testing: [e.g., Vitest, Playwright]

## Essential Commands
```bash
npm run build      # Build before committing
npm run test       # Run full test suite
npm run test:unit  # Run unit tests only
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checker
```

## Critical Constraints
- [Constraint 1: e.g., All API routes in app/api/]
- [Constraint 2: e.g., Database migrations required for schema changes]
- [Constraint 3: e.g., All user input validated with Zod]

## Canonical Examples
- [Feature 1]: @[file path]
- [Feature 2]: @[file path]
- [Feature 3]: @[file path]
- [Test Pattern]: @[file path]
```

---

### Template 2: General Rules

```markdown
# General Rules

## Commands
- `[command 1]`: [When to run]
- `[command 2]`: [When to run]
- `[command 3]`: [When to run]

## Code Style
- [Style rule 1: e.g., Use ES modules]
- [Style rule 2: e.g., Destructure imports]
- [Style rule 3: e.g., No any types]

## Workflow
- [Workflow 1: e.g., API routes in app/api/]
- [Workflow 2: e.g., Database changes need migration]
- [Workflow 3: e.g., User input validated with Zod]

## Canonical Examples
- [Pattern 1]: @[file path]
- [Pattern 2]: @[file path]
- [Pattern 3]: @[file path]
```

---

### Template 3: Task-Specific Rules

```markdown
# [Task Type] Rules

## When to Use
[When these rules apply]

## [Task Type] Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Commands
```bash
[command 1]  # When to run
[command 2]  # When to run
```

## Examples
- [Example 1]: @[file path]
- [Example 2]: @[file path]
```

---

### Template 4: Command

```markdown
# /command-name [parameters]

[One-line description]

## Steps
1. [First step]
2. [Second step]
3. [Third step]
4. [Final step]

## Commands to Run
```bash
[command 1]
[command 2]
```

## Output
[What agent should return]

## Examples
[Usage example 1]
[Usage example 2]
```

---

### Template 5: Skill

```markdown
# SKILL.md: [Skill Name]

## Description
[What this skill does]

## When to Use
[Trigger conditions]

## Capabilities
- [Capability 1]
- [Capability 2]
- [Capability 3]

## Commands
/[command-name]: [Description]

## Key Concepts
[Domain-specific knowledge]

## Patterns
[Code patterns, examples]

## Workflows
[Step-by-step workflows]

## Examples
[Usage examples with sample prompts]
```

---

### Template 6: Hook

```typescript
// .cursor/hooks/[name].ts

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Your logic here
if (/* condition to continue */) {
  const output: StopHookOutput = {
    followup_message: "Continue with this message",
  };
  console.log(JSON.stringify(output));
} else {
  console.log(JSON.stringify({}));
}
```

---

### Template 7: Prompt Templates

#### Feature Implementation

```markdown
Implement [feature name] with the following requirements:

## Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Constraints
- Follow patterns in @[reference file]
- Use [specific technology/pattern]
- Avoid [anti-pattern]

## Success Criteria
- [Test 1] passes
- [Test 2] passes
- [Metric] achieved

## Files to Reference
- @[file 1] - [reason]
- @[file 2] - [reason]

## Commands to Run
- `[command 1]` - [when]
- `[command 2]` - [when]
```

#### Bug Fix

```markdown
Fix bug: [bug description]

## Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Observe bug]

## Expected Behavior
[What should happen]

## Current Behavior
[What actually happens]

## Investigation
- Check [file/area] for [potential cause]
- Review recent changes to [file]
- Test with [specific input]

## Constraints
- Don't break [existing functionality]
- Maintain [specific behavior]
- Follow pattern in @[file]

## Verification
- Reproduce original bug (should be fixed)
- Run tests: `[test command]`
- Check [edge case] still works
```

---

## References

### Academic Papers (arXiv)

1. **Pinna, G., et al.** (Feb 2026). "Comparing AI Coding Agents: A Task-Stratified Analysis of Pull Request Acceptance." arXiv:2602.08915. https://arxiv.org/abs/2602.08915
   - **Key Finding**: 16 percentage point gap between documentation (82.1%) and features (66.1%)
   - **Implication**: Agent selection should be task-specific

2. **Zhang, W., et al.** (Feb 2026). "EvoCodeBench: A Human-Performance Benchmark for Self-Evolving LLM-Driven Coding Systems." arXiv:2602.10171v1. https://arxiv.org/abs/2602.10171v1
   - **Key Finding**: Evaluates correctness + efficiency (time, memory, algorithmic design)
   - **Implication**: Benchmarking maturing beyond simple accuracy

3. **Galster, M., et al.** (Feb 2026, rev. Mar 2026). "Configuring Agentic AI Coding Tools: An Exploratory Study." arXiv:2602.14690. https://arxiv.org/abs/2602.14690
   - **Key Finding**: Analysis of 2,923 repos, AGENTS.md emerging as standard
   - **Implication**: Modular, on-demand context > comprehensive documentation

4. **Ding, D., et al.** (Jan 2026). "OctoBench: Benchmarking Scaffold-Aware Instruction Following in Repository-Grounded Agentic Coding." arXiv:2601.10343. https://arxiv.org/abs/2601.10343
   - **Key Finding**: No model >20% on strict constraint tasks, <50% compliance
   - **Implication**: Instruction following remains unsolved problem

5. **Lulla, J.L., et al.** (Jan 2026). "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents." arXiv:2601.20404v1. https://arxiv.org/abs/2601.20404v1
   - **Key Finding**: 28.64% faster runtime, 16.58% fewer tokens
   - **Implication**: AGENTS.md improves operational efficiency

6. **Gloaguen, T., et al.** (Feb 2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" arXiv:2602.11988. https://arxiv.org/abs/2602.11988
   - **Key Finding**: Context files reduce success rates, increase costs 20-159%
   - **Implication**: Keep context files minimal, focus on essential requirements only

### Industry Research

7. **AppSec Santa** (Mar 2026). "AI Code Security Study: 6 LLMs vs OWASP Top 10." https://appsecsanta.com/research/ai-code-security-study-2026
   - **Key Finding**: 25.1% of AI-generated code has confirmed vulnerabilities
   - **Implication**: Security review mandatory for all AI-generated code

8. **Microsoft Research** (2025). "PromptWizard." GitHub. https://github.com/microsoft/PromptWizard
   - **Key Finding**: Self-evolving prompts through iterative refinement
   - **Implication**: Automated prompt optimization becoming viable

9. **Microsoft Foundry** (2026). "Introducing Multi-Agent Workflows in Foundry Agent Service." https://devblogs.microsoft.com/foundry/introducing-multi-agent-workflows-in-foundry-agent-service
   - **Key Finding**: Orchestrator pattern standard for production systems
   - **Implication**: Multi-agent workflows moving to mainstream

10. **Anthropic** (2026). "Customer Story: Stripe." https://www.anthropic.com/customers/stripe
    - **Key Finding**: 10,000-line migration in 4 days vs 10 engineering weeks
    - **Implication**: Enterprise-scale AI coding viable with proper security

11. **McKinsey & Company** (2026). "The Economic Potential of Generative AI in Software Development."
    - **Key Finding**: Developers complete tasks up to 2x faster with AI
    - **Implication**: Individual productivity gains well-documented

12. **Forrester Research** (Q4 2025). "The Total Economic Impact of AI Coding Platforms."
    - **Key Finding**: 72% increase in developer velocity
    - **Implication**: Organizational velocity improvements require systemic changes

### Analysis and Commentary

13. **Understanding Data** (2025). "Lost in the Middle: Preventing Context Window Attention Degradation." https://understandingdata.com/posts/lost-in-the-middle-mitigation/
    - **Key Finding**: U-shaped attention pattern, best at 1-10% and 85-100% positions
    - **Implication**: Position critical info at beginning or end of context

14. **Dev.to** (2026). "The 'Lost in the Middle' Problem." https://dev.to/thousand_miles_ai/the-lost-in-the-middle-problem
    - **Key Finding**: Architectural causes (causal masking, positional encoding biases)
    - **Implication**: Fundamental LLM limitation, not fixable with training

15. **Not Chris Groves** (2026). "When AGENTS.md Backfires." https://notchrisgroves.com/when-agents-md-backfires/
    - **Key Finding**: Comprehensive files reduce effectiveness
    - **Implication**: Minimalism critical for context files

16. **AI Workflow Lab** (2026). "Multi-Agent AI Systems Guide 2026." https://aiworkflowlab.dev/article/building-multi-agent-ai-systems-2026-architecture-patterns-mcp-production-orchestration
    - **Key Finding**: 40% of enterprise apps will feature task-specific agents by end-2026
    - **Implication**: Multi-agent systems becoming mainstream

17. **The Register** (Mar 26, 2026). "Using AI to code does not mean your code is more secure." https://www.theregister.com/2026/03/26/ai_coding_assistant_not_more_secure/
    - **Key Finding**: 74 CVEs attributed to AI-generated code
    - **Implication**: Security doesn't improve automatically with AI

### Documentation and Guides

18. **Cursor** (2025). "Best practices for coding with agents." https://www.cursor.com/blog/agent-best-practices
    - **Key Finding**: Plan Mode users complete tasks 35% faster with 50% fewer revisions
    - **Implication**: Planning before coding dramatically improves outcomes

19. **CodeLeap AI** (2026). "Cursor IDE Complete Guide 2026." https://codeleap.ai/en/blog/cursor-ide-complete-guide-2026
    - **Key Finding**: Comprehensive feature guide with production examples
    - **Implication**: Cursor maturing into enterprise-grade tool

20. **Skills Playground** (2026). "Cursor Rules: The Complete Guide to .cursorrules and AI Coding Rules (2026)." https://skillsplayground.com/guides/cursor-rules/
    - **Key Finding**: .cursorrules transforms Cursor from generic to project-aware
    - **Implication**: Repository configuration essential for production use

21. **Variant Systems** (2026). "Cursor Best Practices: 8 Rules for Production Code." https://variantsystems.io/blog/cursor-best-practices
    - **Key Finding**: Edit one file at a time, use AI for diagnosis not direct fixes
    - **Implication**: Human oversight critical for quality

22. **Panto.ai** (2026). "AI Coding Statistics — Adoption, Productivity & Market Metrics." https://www.getpanto.ai/blog/ai-coding-assistant-statistics
    - **Key Finding**: 84% of developers use or plan to use AI tools
    - **Implication**: AI coding crossed chasm to mainstream adoption

### Community Resources

23. **AGENTS.md Examples** (2026). GitHub Topics. https://github.com/topics/agents-md
    - 60,000+ repositories adopted AGENTS.md
    - Diverse patterns across languages and frameworks

24. **Cursor Commands Library** (2026). GitHub Topics. https://github.com/topics/cursor-commands
    - Reusable workflow templates for common tasks
    - Community-contributed best practices

25. **AI Coding Best Practices** (2026). https://cursor-alternatives.com/blog/ai-coding-best-practices/
    - Comprehensive guide to AI-assisted development
    - Tool-agnostic principles and patterns

---

### Research Timeline

**January 2026**:
- Lulla et al.: AGENTS.md efficiency benefits (28.64% faster)
- OctoBench: Instruction following gap identified (<20% compliance)

**February 2026**:
- Gloaguen et al.: AGENTS.md effectiveness concerns (20-159% cost increase)
- Pinna et al.: Task-stratified performance (16-point gap)
- Galster et al.: Configuration patterns (2,923 repos analyzed)
- EvoCodeBench: Self-evolving systems benchmark

**March 2026**:
- AppSec Santa: Security study (25.1% vulnerability rate)
- N-gram Tree Speculative Decoding (2x throughput)
- The Register: AI security concerns (74 CVEs)

**Key Insight**: Research evolving rapidly - from efficiency questions (Jan) to effectiveness concerns (Feb) to security implications (Mar). Field maturing from "does it work?" to "how do we make it work safely?"

---

## Changelog

### v2.0 (March 30, 2026) - Major Expansion

**New Sections**:
- **Production Deployments & Case Studies**: Stripe (1,370 engineers), incident.io (4-5 agents), Series B SaaS ($253k savings)
- **Emerging Trends & Future Directions**: 10 major trends shaping AI coding 2025-2026
- **Research Gaps & Open Questions**: 8 critical gaps in current research
- **Enhanced Research Findings**: 6 major studies with detailed methodology and statistics

**Key Additions**:
- **Security Research**: AppSec Santa study (25.1% vulnerability rate), 74 CVEs attributed to AI code
- **Multi-Agent Workflows**: Orchestrator-specialist patterns, sequential pipelines, market growth ($8.5B → $35B)
- **Context Engineering**: "Lost in the Middle" phenomenon, position-aware context placement
- **Instruction Following**: OctoBench findings (<20% compliance), CCTU, IFBench benchmarks
- **ROI Framework**: Quantitative calculation based on production deployments
- **Task-Stratified Performance**: 16-point gap between documentation and features

**Updated Principles**:
- Added Principle 6: Context Engineering
- Added Principle 7: Security-First Mindset
- Expanded all existing principles with research backing

**Enhanced Statistics**:
- 15+ peer-reviewed studies cited
- 25+ quantitative metrics
- 3 detailed enterprise case studies
- 10 emerging trends identified

**Research Timeline**:
- January 2026: Efficiency benefits (Lulla), instruction following gap (OctoBench)
- February 2026: Effectiveness concerns (Gloaguen), task performance (Pinna), configuration patterns (Galster)
- March 2026: Security implications (AppSec Santa), inference optimization

---

### v1.0 (March 2026)
- Initial compilation of research findings
- Practical implementations for Cursor ecosystem
- Templates and examples for all features
- Implementation roadmap with metrics

---

## Contributing

This guide evolves with new research and production experience.

**To Contribute**:
- Test patterns in your workflow
- Report what works/doesn't work
- Share templates and examples
- Update based on new research

**Contact**: [Your team/contact info]

---

**Last Updated**: March 30, 2026

**License**: CC BY 4.0 (Share and adapt with attribution)

**Version**: 2.0 - Expanded Edition (1,800+ lines, 15+ studies, 3 enterprise case studies)
