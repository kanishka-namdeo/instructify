# Plan Mode Pre-Plan Research

## Automatic Research Steps

Before creating ANY plan:

1. **SemanticSearch** (30s)
   - Query: "How is [similar feature] implemented?"
   - Target: Most relevant directory
   - Collect: Top 3-5 patterns

2. **Task Subagents** (60s, parallel)
   - Launch 2-4 explore subagents
   - Use model="fast"
   - run_in_background=true
   - Prompts: "Find [pattern A]", "Find [pattern B]"

3. **ReadLints** (15s)
   - Check target files
   - Note existing issues
   - Include in plan if relevant

4. **AskQuestion** (if ambiguous)
   - Batch ALL questions in ONE call
   - Agent continues research while waiting
   - Present 2-4 options per question

## Output
- Summary of findings
- Reference files for patterns
- Clarified requirements
- Estimated complexity

## Examples

### Example 1: Feature Request
User: "Add user dashboard"

Agent automatically:
1. SemanticSearch: "How are pages structured in this app?"
2. Task (parallel):
   - "Find all API route patterns"
   - "Find all component structures"
3. ReadLints: Check current code health
4. AskQuestion (if needed): "What dashboard widgets are needed?"

### Example 2: Bug Fix
User: "Fix authentication bug"

Agent automatically:
1. SemanticSearch: "How is authentication implemented?"
2. Task: "Find all auth-related code"
3. ReadLints: Check auth files for errors
4. AskQuestion: "Which auth flow is failing?"

### Example 3: Refactor
User: "Refactor checkout flow"

Agent automatically:
1. SemanticSearch: "How is checkout implemented?"
2. Task (parallel):
   - "Find checkout API endpoints"
   - "Find checkout UI components"
   - "Find payment processing code"
3. ReadLints: Check all checkout files
4. AskQuestion: "What are the refactor goals?"
