# Contributing to Instructify

Thank you for your interest in contributing to Instructify! This project is a comprehensive knowledge base and configuration repository for optimizing AI coding agent workflows in Cursor IDE.

We welcome contributions of all kinds: new rules, skills, MCP server configurations, documentation improvements, bug fixes, and usage scenarios.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Adding New Rules](#adding-new-rules)
  - [Creating New Skills](#creating-new-skills)
  - [Adding MCP Server Configurations](#adding-mcp-server-configurations)
  - [Writing Hook Scripts](#writing-hook-scripts)
  - [Improving Documentation](#improving-documentation)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Community](#community)

## Code of Conduct

Please be respectful and constructive in your interactions. We're building a community resource that should be welcoming to all contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/instructify.git
   cd instructify
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies** (if working with hook scripts):
   ```bash
   npm install
   # or
   bun install
   ```

## How to Contribute

### Adding New Rules

Rules are markdown files in `.cursor/rules/` that provide context to the AI agent.

#### Rule Structure

```markdown
# Rule Title

Clear, concise description of what this rule does.

## When to Apply

Specific conditions or triggers for this rule.

## Guidelines

- Clear, actionable guidelines
- Use bullet points for readability
- Include examples when helpful

## Examples

```typescript
// Code examples if relevant
```

## Related Rules

- Links to related rules
```

#### Best Practices
- **Keep it concise**: Rules should be focused and specific (15-50 lines typical)
- **Clear triggers**: Define when the rule should activate
- **Actionable**: Provide clear, implementable guidance
- **Test**: Verify the rule works as expected in Cursor

#### Example: `.cursor/rules/example-rule.md`

```markdown
# API Error Handling

Always implement comprehensive error handling for API calls.

## When to Apply

- Making HTTP requests
- Calling external services
- Database operations

## Guidelines

- Use try-catch blocks for all async operations
- Log errors with context (endpoint, params, user)
- Return user-friendly error messages
- Implement retry logic for transient failures

## Example

```typescript
try {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
} catch (error) {
  logger.error('API call failed', { endpoint, error });
  throw new ApiError('Failed to fetch data', { cause: error });
}
```
```

### Creating New Skills

Skills are dynamic capabilities loaded on-demand, stored in `.cursor/skills/`.

#### Skill Structure

Create a new directory: `.cursor/skills/your-skill-name/`

```
your-skill-name/
└── SKILL.md
```

#### SKILL.md Template

```markdown
# Skill Name

Brief description of the skill's purpose.

## Capabilities

This skill provides:
- Capability 1
- Capability 2
- Capability 3

## When to Use

Specific scenarios where this skill should be activated.

## Implementation

Detailed guidance on how to apply this skill.

## Examples

Practical examples demonstrating the skill in action.

## Dependencies

Any related rules, tools, or other skills.
```

#### Best Practices
- **Modular**: Each skill should have a single, clear purpose
- **Comprehensive**: Cover all aspects of the topic
- **Examples**: Include real-world usage examples
- **Cross-reference**: Link to related rules and skills

### Adding MCP Server Configurations

MCP servers are configured in the `mcps/` directory.

#### Adding a New MCP Server

1. **Create directory**: `mcps/your-server-name/`
2. **Add tool descriptors**: JSON files for each tool
3. **Add resource descriptors**: JSON files for resources (if applicable)
4. **Document**: Add documentation in `docs/mcp/your-server-name.md`

#### Tool Descriptor Format

```json
{
  "name": "tool-name",
  "description": "What this tool does",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Parameter description"
      }
    },
    "required": ["param1"]
  }
}
```

#### Best Practices
- **Clear descriptions**: Explain what the tool does and when to use it
- **Validate inputs**: Define strict input schemas
- **Error handling**: Document error cases and responses
- **Test thoroughly**: Verify tools work in production

### Writing Hook Scripts

Hooks are TypeScript scripts that run automatically, located in `.cursor/hooks/`.

#### Hook Script Template

```typescript
// .cursor/hooks/your-hook.ts

import { HookContext } from './types';

export default async function yourHook(context: HookContext) {
  // Hook logic here
  
  return {
    success: true,
    message: 'Hook executed successfully',
    data: {}
  };
}
```

#### Code Style Guidelines for Hooks

1. **TypeScript**: Use TypeScript for all hook scripts
2. **Type Safety**: Define and use proper types
3. **Error Handling**: Implement comprehensive error handling
4. **Logging**: Log important events and errors
5. **Performance**: Keep hooks fast (< 2 seconds typical)

#### Example: Auto-Validate Hook

```typescript
// .cursor/hooks/auto-validate.ts

interface ValidationResult {
  file: string;
  issues: string[];
  passed: boolean;
}

export default async function autoValidate(context: HookContext): Promise<void> {
  const changedFiles = context.getChangedFiles();
  const results: ValidationResult[] = [];

  for (const file of changedFiles) {
    const issues = await validateFile(file);
    results.push({
      file,
      issues,
      passed: issues.length === 0
    });
  }

  const failedValidations = results.filter(r => !r.passed);
  
  if (failedValidations.length > 0) {
    context.report('Validation failed', failedValidations);
  }
}
```

### Improving Documentation

Documentation is the heart of this project. We welcome improvements to:

- **Existing guides**: Clarify, expand, or update current documentation
- **New scenarios**: Add usage scenarios for specific workflows
- **Quick references**: Create cheat sheets for tools and commands
- **Best practices**: Document patterns and anti-patterns
- **Examples**: Add real-world code examples

#### Documentation Structure

Follow the existing structure in the `docs/` directory:

```
docs/
├── builtin/           # Built-in Cursor tools
├── mcp/              # MCP server documentation
├── comparisons/      # Tool comparison guides
├── scenarios/        # Usage workflows
├── quickref/         # Quick reference cards
└── best-practices/   # Best practices guides
```

#### Documentation Guidelines

- **Clear headings**: Use hierarchical headings (##, ###, ####)
- **Code blocks**: Use markdown code blocks with language tags
- **Links**: Cross-reference related documentation
- **Examples**: Include practical examples
- **Screenshots**: Add visuals when helpful (for UI tools)

## Development Setup

### Prerequisites

- Node.js 20+ or Bun 1.0+
- Git
- Cursor IDE (recommended for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/instructify.git
cd instructify

# Install dependencies
npm install
# or
bun install

# Run tests (if applicable)
npm test
```

### Testing Changes

1. **Test in Cursor**: Load your fork in Cursor IDE
2. **Verify rules**: Ensure rules activate correctly
3. **Test hooks**: Trigger hook conditions and verify behavior
4. **Check skills**: Confirm skills load when needed

## Code Style Guidelines

### General Guidelines

- **Clarity**: Write for humans, not just machines
- **Consistency**: Follow existing patterns in the codebase
- **Conciseness**: Be brief but complete
- **Examples**: Show, don't just tell

### Markdown Style

- Use ATX-style headings (`#`, `##`, `###`)
- Use bullet points for lists
- Use backticks for inline code
- Use fenced code blocks with language tags
- Use relative links for internal references

### TypeScript Style

- Use TypeScript for all hook scripts
- Follow PEP 8-inspired formatting
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Handle errors gracefully

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test your changes** in Cursor IDE

4. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add: new skill for XYZ"
   # or
   git commit -m "Fix: typo in ABC documentation"
   # or
   git commit -m "Improve: error handling in validation hook"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub:
   - Use a clear title
   - Describe what you changed and why
   - Link to related issues (if applicable)
   - Include testing notes

7. **Respond to feedback** and make requested changes

8. **Celebrate** when your PR is merged! 🎉

### PR Title Conventions

- `Add: ` for new features
- `Fix: ` for bug fixes
- `Improve: ` for enhancements
- `Refactor: ` for code refactoring
- `Docs: ` for documentation changes
- `Chore: ` for maintenance tasks

### PR Description Template

```markdown
## Summary
Brief description of changes

## What Changed
- List of key changes
- Files added/modified/removed

## Why
Reason for this change (problem solved, improvement made)

## Testing
How you tested this change

## Checklist
- [ ] Follows style guidelines
- [ ] Tested in Cursor IDE
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or clearly documented)
```

## Testing

### Manual Testing

1. **Load in Cursor**: Open the project in Cursor IDE
2. **Trigger rules**: Perform actions that should activate your rules
3. **Run hooks**: Execute code changes to trigger hooks
4. **Verify skills**: Confirm skills load when needed

### Automated Testing (for hooks)

If your hook script supports automated testing:

```bash
# Run tests
npm test

# Run specific test file
npm test -- hooks/auto-validate.test.ts
```

### Testing Checklist

- [ ] Rules activate correctly
- [ ] Hooks execute without errors
- [ ] Skills load on-demand
- [ ] Documentation renders properly
- [ ] Links work correctly
- [ ] Code examples are valid

## Community

### Getting Help

- **Documentation**: Check existing docs first
- **Issues**: Open an issue for questions or problems
- **Discussions**: Use GitHub Discussions for general conversations

### Staying Updated

- Watch the repository for notifications
- Follow the changelog for updates
- Participate in discussions

## Thank You!

Every contribution, no matter how small, helps make Instructify better for everyone. We appreciate your time and effort in improving this project!

---

**Questions?** Open an issue or discussion on GitHub. We're here to help!
