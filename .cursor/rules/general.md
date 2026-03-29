# General Rules

## Essential Commands
- `npm run lint`: After substantive changes
- `npm run test`: Prefer single test files
- `npm run typecheck`: After TypeScript changes

## Critical Constraints
- Use ES modules (import/export)
- TypeScript strict mode, no `any`
- All user input validated with Zod

## Canonical Examples
- Component: `@components/Button.tsx`
- API route: `@app/api/users/route.ts`
- Test: `@__tests__/auth.test.ts`

**Note**: See @.cursor/rules/ for task-specific rules
