// .cursor/hooks/auto-validate.ts
// Automatic validation after every code change

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export {};

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

interface ValidationResult {
  name: string;
  passed: boolean;
  error?: string;
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

// Try to detect code changes from conversation file
const conversationFile = join(process.cwd(), `.cursor/conversations/${input.conversation_id}.json`);
let conversation;
try {
  if (existsSync(conversationFile)) {
    conversation = JSON.parse(readFileSync(conversationFile, 'utf-8'));
  }
} catch {
  // If we can't read the conversation, skip change detection
  conversation = null;
}

// Detect if code changes were made (simplified detection)
const hasCodeChanges = conversation?.messages?.some((m: any) => 
  m.content?.includes('StrReplace') || 
  m.content?.includes('Write') ||
  m.content?.includes('EditNotebook')
);

if (!hasCodeChanges) {
  console.error("[Auto-Validate] No code changes detected, skipping validation");
  console.log(JSON.stringify({}));
  process.exit(0);
}

console.error("[Auto-Validate] Running automatic validation...");

// Automatic validation sequence
const validations: ValidationResult[] = [];

// 1. Run ESLint (via MCP if available, otherwise CLI)
try {
  execSync('npm run lint', { stdio: 'pipe', encoding: 'utf-8' });
  validations.push({ name: 'ESLint', passed: true });
  console.error("[Auto-Validate] ✓ ESLint passed");
} catch (error: any) {
  validations.push({
    name: 'ESLint',
    passed: false,
    error: error.stdout?.toString() || error.message
  });
  console.error("[Auto-Validate] ✗ ESLint failed");
}

// 2. Run typecheck (TypeScript projects)
try {
  execSync('npm run typecheck', { stdio: 'pipe', encoding: 'utf-8' });
  validations.push({ name: 'Typecheck', passed: true });
  console.error("[Auto-Validate] ✓ Typecheck passed");
} catch (error: any) {
  validations.push({
    name: 'Typecheck',
    passed: false,
    error: error.stdout?.toString() || error.message
  });
  console.error("[Auto-Validate] ✗ Typecheck failed");
}

// 3. Run tests (if test files mentioned in conversation)
const hasTestFiles = conversation?.messages?.some((m: any) => 
  m.content?.includes('.test.ts') ||
  m.content?.includes('.spec.ts')
);

if (hasTestFiles) {
  try {
    execSync('npm run test', { stdio: 'pipe', encoding: 'utf-8' });
    validations.push({ name: 'Tests', passed: true });
    console.error("[Auto-Validate] ✓ Tests passed");
  } catch (error: any) {
    validations.push({
      name: 'Tests',
      passed: false,
      error: error.stdout?.toString() || error.message
    });
    console.error("[Auto-Validate] ✗ Tests failed");
  }
} else {
  console.error("[Auto-Validate] No test files detected, skipping test run");
}

// Generate validation report
const failedValidations = validations.filter(v => !v.passed);
const validationReport = `## Auto-Validation Report

Generated: ${new Date().toISOString()}
Conversation: ${input.conversation_id}

## Results

${validations.map(v => `${v.passed ? '✅' : '❌'} ${v.name}${v.error ? `:\n\`\`\`${v.error}\`\`\`` : ''}`).join('\n\n')}

## Summary

Total: ${validations.length} checks
Passed: ${validations.filter(v => v.passed).length}
Failed: ${failedValidations.length}
${failedValidations.length === 0 ? '\n✓ All validations passed!' : '\n⚠️ Some validations failed. Please fix the issues above.'}
`;

writeFileSync(join(process.cwd(), '.cursor/auto-validation-report.md'), validationReport);

// Provide feedback
if (failedValidations.length > 0) {
  const output: StopHookOutput = {
    followup_message: `⚠️ Validation failed: ${failedValidations.map(v => v.name).join(', ')}. See .cursor/auto-validation-report.md for details.`,
  };
  console.log(JSON.stringify(output));
} else {
  console.error("[Auto-Validate] ✓ All validations passed");
  console.log(JSON.stringify({}));
}
