# Cursor Hooks: Complete Guide

A comprehensive reference for Cursor hooks, covering all hook types, practical scenarios, and implementation examples.

---

## Table of Contents

1. [Overview](#overview)
2. [Hook Types Reference](#hook-types-reference)
3. [Security & Governance](#security--governance)
4. [Code Quality & Automation](#code-quality--automation)
5. [Context Management & RAG](#context-management--rag)
6. [Multi-Agent Orchestration](#multi-agent-orchestration)
7. [Analytics & Observability](#analytics--observability)
8. [Error Recovery & Self-Healing](#error-recovery--self-healing)
9. [Configuration Reference](#configuration-reference)
10. [Best Practices](#best-practices)

---

## Overview

Cursor hooks are scripts that execute at specific points in the AI agent lifecycle, enabling you to:

- **Observe**: Monitor agent actions, tool usage, and file edits
- **Control**: Block, modify, or gate operations based on custom logic
- **Extend**: Add custom behavior, integrations, and automations

Hooks can be written in any language (Bash, Python, TypeScript, Go) and return structured responses to influence agent behavior.

### Hook Response Format

Hooks receive event data via stdin (JSON) and can return:

```json
{
  "block": false,
  "feedback_message": "Optional message to guide the agent",
  "updated_input": {},
  "updated_tool_output": {},
  "followup_message": "Optional auto-triggered message"
}
```

---

## Hook Types Reference

### Lifecycle Hooks

| Hook | When It Fires | Common Uses |
|------|---------------|-------------|
| `sessionStart` | When a new agent session begins | Context injection, secret loading, RAG retrieval |
| `sessionEnd` | When a session completes | Summaries, notifications, handoffs |
| `beforeSubmitPrompt` | Before user prompt is submitted | Guardrails, prompt enhancement |
| `afterAgentResponse` | After agent generates response | Token tracking, quality analysis |

### File Operation Hooks

| Hook | When It Fires | Common Uses |
|------|---------------|-------------|
| `beforeFileEdit` | Before agent edits a file | Validation, approval workflows |
| `afterFileEdit` | After agent edits a file | Formatting, linting, CI triggers |
| `beforeTabFileRead` | Before Tab reads a file | Content redaction, access control |
| `afterTabFileEdit` | After Tab makes inline edit | Edit tracking, license headers |

### Tool Execution Hooks

| Hook | When It Fires | Common Uses |
|------|---------------|-------------|
| `preToolUse` | Before any tool execution | Tool gating, input modification |
| `postToolUse` | After tool completes | Output modification, analytics |
| `postToolUseFailure` | When tool execution fails | Error recovery, retry logic |
| `beforeShellExecution` | Before shell command runs | Security scanning, command blocking |

### Agent Lifecycle Hooks

| Hook | When It Fires | Common Uses |
|------|---------------|-------------|
| `subagentStart` | When subagent is spawned | Routing, policy enforcement |
| `subagentStop` | When subagent completes | Iteration, retry, escalation |
| `preCompact` | Before context window compaction | Memory preservation, analytics |
| `stop` | When agent terminates | Loop detection, failure analysis |

---

## Security & Governance

### 1. Secrets Scanning

**Scenario**: Prevent hardcoded secrets from being committed or used in shell commands.

```bash
#!/bin/bash
# hooks/secrets-scan.sh

input=$(cat)
command=$(echo "$input" | jq -r '.command')

# Check for common secret patterns
if echo "$command" | grep -qE '(password|secret|api_key|token)\s*[=:]\s*["\'][^"\']+["\']'; then
  echo '{"block": true, "feedback_message": "Potential secret detected in command. Use environment variables instead."}'
  exit 0
fi

echo '{"block": false}'
```

### 2. Destructive Command Blocking

**Scenario**: Block dangerous git and shell commands.

```bash
#!/bin/bash
# hooks/block-destructive.sh

input=$(cat)
command=$(echo "$input" | jq -r '.command')

# Block destructive git operations
if echo "$command" | grep -qE 'git\s+(push\s+--force|reset\s+--hard|checkout\s+--force)'; then
  echo '{"block": true, "feedback_message": "Destructive git command blocked. Use git push --force-with-lease or git reset --soft instead."}'
  exit 0
fi

# Block recursive delete
if echo "$command" | grep -qE 'rm\s+-rf\s+(/|~|\*)'; then
  echo '{"block": true, "feedback_message": "Recursive delete to root/home blocked. Use trash-cli or specify exact paths."}'
  exit 0
fi

echo '{"block": false}'
```

### 3. Kubernetes Production Protection

**Scenario**: Require approval for production namespace deployments.

```python
#!/usr/bin/env python3
# hooks/kube-prod-guard.py

import sys
import json
import yaml

data = json.load(sys.stdin)
command = data.get('command', '')

if 'kubectl' in command and ('apply' in command or 'delete' in command):
    # Parse kubectl command to extract namespace
    if '--namespace=production' in command or '-n prod' in command:
        print(json.dumps({
            "block": True,
            "feedback_message": "Production namespace changes require manual approval. Please run kubectl command manually after review."
        }))
        sys.exit(0)

print(json.dumps({"block": False}))
```

### 4. MCP Tool Governance

**Scenario**: Log and validate MCP tool invocations.

```typescript
#!/usr/bin/env tsx
// hooks/mcp-audit.ts

import * as fs from 'fs';

const payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
const { mcp_server, mcp_tool, arguments: toolArgs } = payload;

// Log to audit file
const logEntry = {
  timestamp: new Date().toISOString(),
  server: mcp_server,
  tool: mcp_tool,
  conversation_id: payload.conversation_id,
  user: process.env.USER
};

fs.appendFileSync(
  '/tmp/mcp-audit.log',
  JSON.stringify(logEntry) + '\n'
);

// Block sensitive tools
const blockedTools = ['deleteDatabase', 'executeArbitraryCode', 'accessSecrets'];
if (blockedTools.includes(mcp_tool)) {
  console.log(JSON.stringify({
    block: true,
    feedback_message: `MCP tool '${mcp_tool}' is blocked by policy.`
  }));
  process.exit(0);
}

console.log(JSON.stringify({ block: false }));
```

### 5. Ephemeral Secret Injection

**Scenario**: Load secrets at session start without writing to disk.

```bash
#!/bin/bash
# hooks/load-secrets.sh

# Read from 1Password or secret manager
export DATABASE_URL=$(op read "op://vault/database/url")
export API_KEY=$(op read "op://vault/api/key")

# Return session context with secrets as env vars
cat <<EOF
{
  "context": "Secrets loaded for this session only. Do not write them to files."
}
EOF
```

---

## Code Quality & Automation

### 1. Post-Edit Formatting Pipeline

**Scenario**: Automatically format, lint, and validate after each edit.

```bash
#!/bin/bash
# hooks/post-edit-pipeline.sh

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path')

# Run formatter
prettier --write "$file_path" 2>/dev/null || true

# Run linter
eslint "$file_path" --fix 2>/dev/null || true

# Run type checker
tsc --noEmit 2>&1 | grep -q "$file_path" && {
  echo '{"feedback_message": "Type errors detected. Review the file."}'
  exit 0
}

echo '{"block": false}'
```

### 2. Git Checkpoint Automation

**Scenario**: Create a git commit after each AI generation for easy undo.

```bash
#!/bin/bash
# hooks/auto-commit.sh

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path')
timestamp=$(date +%Y%m%d_%H%M%S)

# Stage the file
git add "$file_path"

# Create commit with timestamp
git commit -m "AI checkpoint: $timestamp - $file_path" --no-verify

echo '{"block": false}'
```

### 3. Tool Standardization

**Scenario**: Enforce approved tooling (e.g., bun over npm).

```bash
#!/bin/bash
# hooks/tool-policy.sh

input=$(cat)
command=$(echo "$input" | jq -r '.command')

# Replace npm with bun
if echo "$command" | grep -q '^npm install'; then
  new_command=$(echo "$command" | sed 's/npm install/bun install/')
  echo "{\"updated_input\": {\"command\": \"$new_command\"}, \"feedback_message\": \"Using bun instead of npm per team policy.\"}"
  exit 0
fi

# Block yarn entirely
if echo "$command" | grep -q '^yarn'; then
  echo '{"block": true, "feedback_message": "Yarn is not approved. Use bun or npm instead."}'
  exit 0
fi

echo '{"block": false}'
```

### 4. Semantic Commit Message Generation

**Scenario**: Auto-generate conventional commit messages from diffs.

```python
#!/usr/bin/env python3
# hooks/generate-commit-msg.py

import sys
import json
import subprocess

data = json.load(sys.stdin)
file_path = data.get('file_path', '')

# Get diff
diff = subprocess.run(
    ['git', 'diff', '--cached', file_path],
    capture_output=True, text=True
).stdout

# Simple heuristic for commit type
if 'feat' in diff.lower() or 'add' in diff.lower():
    commit_type = 'feat'
elif 'fix' in diff.lower() or 'bug' in diff.lower():
    commit_type = 'fix'
elif 'refactor' in diff.lower():
    commit_type = 'refactor'
else:
    commit_type = 'chore'

# Extract first meaningful line
lines = [l for l in diff.split('\n') if l.startswith('+') and not l.startswith('+++')]
summary = lines[0][:50] if lines else 'update'

print(json.dumps({
    "followup_message": f"Suggested commit message: {commit_type}: {summary}"
}))
```

---

## Context Management & RAG

### 1. Session Context Injection

**Scenario**: Load relevant documentation at session start.

```bash
#!/bin/bash
# hooks/inject-context.sh

# Detect project type
if [ -f "package.json" ]; then
  PROJECT_TYPE="nodejs"
elif [ -f "requirements.txt" ]; then
  PROJECT_TYPE="python"
elif [ -f "Cargo.toml" ]; then
  PROJECT_TYPE="rust"
else
  PROJECT_TYPE="unknown"
fi

# Load project-specific context
case $PROJECT_TYPE in
  nodejs)
    CONTEXT="This is a Node.js project using Express. Follow these patterns:
    - Use async/await for all I/O operations
    - Wrap routes in try-catch blocks
    - Use zod for input validation"
    ;;
  python)
    CONTEXT="This is a Python project using FastAPI. Follow these patterns:
    - Use type hints for all function signatures
    - Use Pydantic models for request/response validation
    - Follow PEP 8 style guidelines"
    ;;
  *)
    CONTEXT="General project. Follow best practices for the detected language."
    ;;
esac

cat <<EOF
{
  "context": "$CONTEXT"
}
EOF
```

### 2. RAG Knowledge Base Integration

**Scenario**: Query vector database for relevant context.

```python
#!/usr/bin/env python3
# hooks/rag-context.py

import sys
import json
import requests

data = json.load(sys.stdin)
user_prompt = data.get('prompt', '')

# Query vector database for top-K relevant docs
response = requests.post(
    'http://localhost:6333/collections/code-knowledge/search',
    json={
        'query': user_prompt,
        'limit': 3
    }
)

if response.status_code == 200:
    docs = response.json()
    context = '\n\n'.join([d['content'] for d in docs])
    
    print(json.dumps({
        'context': f'Relevant documentation:\n{context}'
    }))
else:
    print(json.dumps({'block': False}))
```

### 3. Pre-Compaction Memory Preservation

**Scenario**: Save critical context before window compression.

```bash
#!/bin/bash
# hooks/save-memory.sh

input=$(cat)

# Extract important information
context_tokens=$(echo "$input" | jq '.context_tokens')
message_count=$(echo "$input" | jq '.message_count')

# Save to external memory
cat <<EOF >> ~/agent-memory.jsonl
{"timestamp": "$(date -Iseconds)", "context_tokens": $context_tokens, "message_count": $message_count}
EOF

# Could also call vector DB API here
echo '{"block": false}'
```

---

## Multi-Agent Orchestration

### 1. Subagent Routing

**Scenario**: Route tasks to specialized subagent types.

```typescript
#!/usr/bin/env tsx
// hooks/route-subagent.ts

import * as fs from 'fs';

const payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
const task = payload.task?.toLowerCase() || '';

let subagentType = 'generalPurpose';
let additionalContext = '';

if (task.includes('research') || task.includes('explore') || task.includes('find')) {
  subagentType = 'explore';
  additionalContext = 'Use broad file searches and semantic search. Cast a wide net.';
} else if (task.includes('test') || task.includes('verify')) {
  subagentType = 'shell';
  additionalContext = 'Focus on running tests and verifying functionality.';
} else if (task.includes('review') || task.includes('audit')) {
  subagentType = 'generalPurpose';
  additionalContext = 'Apply strict linting and security rules. Be thorough.';
}

console.log(JSON.stringify({
  subagent_type: subagentType,
  additional_context: additionalContext
}));
```

### 2. Iterative Refinement Loop

**Scenario**: Auto-trigger multiple refinement iterations.

```bash
#!/bin/bash
# hooks/iterate-subagent.sh

input=$(cat)
status=$(echo "$input" | jq -r '.status')
iteration=$(echo "$input" | jq -r '.iteration // 0')

if [ "$status" = "success" ] && [ "$iteration" -lt 3 ]; then
  case $iteration in
    0)
      echo '{"followup_message": "Now run the test suite to verify the implementation."}'
      ;;
    1)
      echo '{"followup_message": "Fix any test failures and optimize for performance."}'
      ;;
    2)
      echo '{"followup_message": "Add documentation and type hints. Mark task complete."}'
      ;;
  esac
else
  echo '{"block": false}'
fi
```

### 3. Retry with Exponential Backoff

**Scenario**: Auto-retry failed operations with increasing delays.

```python
#!/usr/bin/env python3
# hooks/auto-retry.py

import sys
import json
import time

data = json.load(sys.stdin)
status = data.get('status', '')
retry_count = data.get('retry_count', 0)

if status == 'error' and retry_count < 3:
    delay = 2 ** retry_count  # 2, 4, 8 seconds
    print(json.dumps({
        'followup_message': f'Retrying after {delay}s delay (attempt {retry_count + 1}/3)',
        'metadata': {'retry_delay': delay}
    }))
else:
    print(json.dumps({
        'block': False,
        'feedback_message': 'Max retries reached. Manual intervention required.' if retry_count >= 3 else ''
    }))
```

---

## Analytics & Observability

### 1. Tool Usage Analytics

**Scenario**: Track which tools the agent uses most.

```typescript
#!/usr/bin/env tsx
// hooks/track-tool-usage.ts

import * as fs from 'fs';

const payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
const { tool_name, duration, conversation_id } = payload;

const metrics = {
  timestamp: new Date().toISOString(),
  tool: tool_name,
  duration_ms: duration,
  conversation_id,
  user: process.env.USER
};

fs.appendFileSync(
  '/tmp/tool-metrics.jsonl',
  JSON.stringify(metrics) + '\n'
);

// Send to analytics endpoint
fetch('http://localhost:3000/api/metrics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(metrics)
}).catch(console.error);

console.log(JSON.stringify({ block: false }));
```

### 2. Cost Tracking

**Scenario**: Track token usage and estimate costs.

```python
#!/usr/bin/env python3
# hooks/track-tokens.py

import sys
import json

data = json.load(sys.stdin)
tokens = data.get('tokens', {})
model = data.get('model', 'unknown')

# Token pricing (example rates)
PRICING = {
    'gpt-4': {'input': 0.00003, 'output': 0.00006},
    'gpt-3.5-turbo': {'input': 0.0000015, 'output': 0.000002},
    'claude-3-opus': {'input': 0.000015, 'output': 0.000075}
}

input_tokens = tokens.get('input', 0)
output_tokens = tokens.get('output', 0)

price = PRICING.get(model, {'input': 0, 'output': 0})
cost = (input_tokens * price['input']) + (output_tokens * price['output'])

# Log to file
with open('/tmp/token-usage.jsonl', 'a') as f:
    f.write(json.dumps({
        'timestamp': data.get('timestamp'),
        'model': model,
        'input_tokens': input_tokens,
        'output_tokens': output_tokens,
        'estimated_cost_usd': cost
    }) + '\n')

print(json.dumps({'block': False}))
```

### 3. Loop Detection

**Scenario**: Detect and alert on infinite loop patterns.

```bash
#!/bin/bash
# hooks/detect-loops.sh

input=$(cat)
loop_count=$(echo "$input" | jq -r '.loop_count')
conversation_id=$(echo "$input" | jq -r '.conversation_id')

if [ "$loop_count" -gt 5 ]; then
  # Send alert
  curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"⚠️ Agent loop detected in conversation $conversation_id (loop_count: $loop_count)\"}"
  
  echo '{"block": true, "feedback_message": "Loop detected. Agent has repeated this action 5+ times. Consider rephrasing your request."}'
else
  echo '{"block": false}'
fi
```

---

## Error Recovery & Self-Healing

### 1. Dependency Installation Recovery

**Scenario**: Auto-install missing dependencies on import errors.

```python
#!/usr/bin/env python3
# hooks/install-missing-deps.py

import sys
import json
import re

data = json.load(sys.stdin)
error_output = data.get('output', '')

# Detect missing Python package
match = re.search(r"ModuleNotFoundError: No module named '(\w+)'", error_output)
if match:
    package = match.group(1)
    print(json.dumps({
        'followup_message': f'Missing package detected: {package}. Run `pip install {package}` to install.'
    }))
    sys.exit(0)

# Detect missing Node module
match = re.search(r"Cannot find module '(@?[\w/-]+)'", error_output)
if match:
    package = match.group(1)
    print(json.dumps({
        'followup_message': f'Missing package detected: {package}. Run `bun install {package}` to install.'
    }))
    sys.exit(0)

print(json.dumps({'block': False}))
```

### 2. Port Conflict Resolution

**Scenario**: Detect port conflicts and suggest alternatives.

```bash
#!/bin/bash
# hooks/port-conflict.sh

input=$(cat)
command=$(echo "$input" | jq -r '.command')
output=$(echo "$input" | jq -r '.output')

# Detect port already in use
if echo "$output" | grep -qE "(Address already in use|EADDRINUSE|port.*occupied)"; then
  # Extract port from command
  port=$(echo "$command" | grep -oE ':[0-9]+' | head -1 | tr -d ':')
  
  if [ -n "$port" ]; then
    new_port=$((port + 1))
    new_command=$(echo "$command" | sed "s/:$port/:$new_port/")
    
    echo "{\"updated_input\": {\"command\": \"$new_command\"}, \"feedback_message\": \"Port $port is in use. Trying port $new_port instead.\"}"
    exit 0
  fi
fi

echo '{"block": false}'
```

### 3. Credential Refresh

**Scenario**: Auto-refresh expired credentials on auth errors.

```bash
#!/bin/bash
# hooks/refresh-credentials.sh

input=$(cat)
output=$(echo "$input" | jq -r '.output')

# Detect authentication errors
if echo "$output" | grep -qiE "(unauthorized|401|authentication failed|token expired|invalid credentials)"; then
  # Trigger credential refresh
  echo '{"followup_message": "Authentication failed. Refreshing credentials..."}'
  
  # Call your credential manager
  # op signin --force
  # or aws sso login
  # or gcloud auth login
  
  exit 0
fi

echo '{"block": false}'
```

---

## Configuration Reference

### Basic Configuration

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": "./hooks/audit.sh",
        "timeout": 5
      }
    ],
    "afterFileEdit": [
      {
        "command": "prettier --write",
        "timeout": 10
      }
    ]
  }
}
```

### Advanced Configuration with Matchers

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": "./hooks/block-git.sh",
        "timeout": 5,
        "matcher": "git"
      },
      {
        "command": "./hooks/kube-guard.py",
        "timeout": 10,
        "matcher": "kubectl"
      },
      {
        "command": "./hooks/secrets-scan.sh",
        "timeout": 5,
        "matcher": "password|secret|api_key|token"
      }
    ],
    "subagentStart": [
      {
        "command": "./hooks/route-subagent.ts",
        "timeout": 5,
        "priority": 1
      }
    ]
  }
}
```

### Multi-Tier Hook Deployment

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": "/etc/cursor/hooks/enterprise-policy.sh",
        "timeout": 5,
        "failClosed": true,
        "priority": 1
      },
      {
        "command": "./team-hooks/team-workflow.sh",
        "timeout": 5,
        "priority": 2
      },
      {
        "command": "./hooks/project-specific.sh",
        "timeout": 5,
        "priority": 3
      }
    ]
  }
}
```

### Hook with Prompt Interaction

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "type": "prompt",
        "prompt": "Is this command safe? Only allow read-only operations.",
        "timeout": 30
      }
    ]
  }
}
```

---

## Best Practices

### 1. Hook Design Principles

**Keep hooks fast**: Set aggressive timeouts (5-10s max) to avoid blocking the agent.

**Fail gracefully**: Return valid JSON even on errors. Use `failClosed: true` only for critical security hooks.

**Log everything**: Write structured logs to files for debugging and analytics.

**Test in shadow mode**: Run hooks without blocking first to validate logic.

### 2. Security Considerations

```bash
#!/bin/bash
# Good: Validate and sanitize
input=$(cat)
command=$(echo "$input" | jq -r '.command' | tr -cd '[:alnum:][:space:]-_.')

# Bad: Don't trust unvalidated input
# command=$(echo "$input" | jq -r '.command')
# eval "$command"  # NEVER do this!
```

### 3. Error Handling

```python
#!/usr/bin/env python3
# Good: Comprehensive error handling
import sys
import json

try:
    data = json.load(sys.stdin)
    # Process data...
    print(json.dumps({'block': False}))
except json.JSONDecodeError as e:
    sys.stderr.write(f"JSON parse error: {e}\n")
    print(json.dumps({'block': False, 'feedback_message': 'Hook parse error - proceeding with caution'}))
except Exception as e:
    sys.stderr.write(f"Unexpected error: {e}\n")
    print(json.dumps({'block': True}))  # Fail closed on unknown errors
```

### 4. Performance Optimization

```typescript
#!/usr/bin/env tsx
// Good: Cache expensive operations
import * as fs from 'fs';
import * as crypto from 'crypto';

const CACHE_FILE = '/tmp/hook-cache.json';
let cache = fs.existsSync(CACHE_FILE) 
  ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) 
  : {};

const payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
const cacheKey = crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');

if (cache[cacheKey]) {
  console.log(JSON.stringify(cache[cacheKey]));
  process.exit(0);
}

// Expensive operation...
const result = { block: false };
cache[cacheKey] = result;
fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));

console.log(JSON.stringify(result));
```

### 5. Testing Hooks

```bash
#!/bin/bash
# Test hook with sample input
echo '{"command": "git push --force"}' | ./hooks/block-destructive.sh

# Expected output:
# {"block": true, "feedback_message": "Destructive git command blocked..."}

# Test with safe command
echo '{"command": "git status"}' | ./hooks/block-destructive.sh

# Expected output:
# {"block": false}
```

### 6. Debugging Tips

```bash
# Enable verbose logging in hooks
export HOOK_DEBUG=1

# View hook logs in real-time
tail -f /tmp/hook-logs.jsonl

# Replay a session's hook inputs
cat session-123-hook-inputs.jsonl | while read line; do
  echo "$line" | ./hooks/your-hook.sh
done
```

---

## Quick Reference: Hook Input/Output

### Common Input Fields

```typescript
interface HookInput {
  // All hooks
  conversation_id: string;
  timestamp: string;
  user_email?: string;
  
  // File hooks
  file_path?: string;
  range?: { start: number; end: number };
  old_line?: string;
  new_line?: string;
  
  // Tool hooks
  tool_name?: string;
  tool_input?: any;
  tool_output?: any;
  duration?: number;
  status?: 'success' | 'error';
  
  // Shell hooks
  command?: string;
  output?: string;
  exit_code?: number;
  
  // Subagent hooks
  task?: string;
  subagent_type?: 'generalPurpose' | 'explore' | 'shell';
  agent_transcript_path?: string;
  git_branch?: string;
  is_parallel_worker?: boolean;
  
  // Compact hooks
  context_tokens?: number;
  message_count?: number;
  is_first_compaction?: boolean;
  
  // Stop hooks
  loop_count?: number;
  is_interrupt?: boolean;
}
```

### Common Output Fields

```typescript
interface HookOutput {
  block?: boolean;
  feedback_message?: string;
  updated_input?: any;
  updated_tool_output?: any;
  updated_mcp_tool_output?: any;
  followup_message?: string;
  context?: string;
  metadata?: Record<string, any>;
}
```

---

## Resources

- [Official Cursor Hooks Documentation](https://cursor.com/docs/hooks)
- [GitButler Deep Dive](https://blog.gitbutler.com/cursor-hooks-deep-dive)
- [MintMCP Governance Guide](https://www.mintmcp.com/blog/mcp-governance-cursor-hooks)
- [Partner Integration Examples](https://cursor.com/blog/hooks-partners)

---

*Last updated: March 2026*
