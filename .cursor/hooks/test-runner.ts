import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

const TEST_REPORT_PATH = join(process.cwd(), ".cursor/test-report.md");

// Read input from stdin
const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Only run tests on completion
if (input.status !== "completed") {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Check if any code changes were made
const codeChanged = true; // Assume code changed for now

if (!codeChanged) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

// Find test files related to changed code
// Simplified: In real implementation, would track which files changed
const testCommand = "npm run test";

try {
  console.log("Running tests...");
  
  let testOutput = "";
  let testsPassed = false;
  
  try {
    // Try to run tests
    testOutput = execSync(testCommand, { 
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 120000 // 120s timeout for full test suite
    }).toString();
    testsPassed = true;
  } catch (error: any) {
    testOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
    testsPassed = false;
  }
  
  // Generate test report
  const timestamp = new Date().toISOString();
  const report = `## ${timestamp}\n\n### Test Results\n\n${testsPassed ? '✅ PASSED' : '❌ FAILED'}\n\n${testOutput}\n\n`;
  
  if (existsSync(TEST_REPORT_PATH)) {
    writeFileSync(TEST_REPORT_PATH, report, { flag: true });
  } else {
    writeFileSync(TEST_REPORT_PATH, `# Test Report\n\n${report}`);
  }
  
  // Return appropriate message
  if (testsPassed) {
    const output: StopHookOutput = {
      followup_message: `✅ All tests passed. See ${TEST_REPORT_PATH} for details.`,
    };
    console.log(JSON.stringify(output));
  } else {
    const output: StopHookOutput = {
      followup_message: `❌ Tests failed. Please fix failing tests. See ${TEST_REPORT_PATH} for details.`,
    };
    console.log(JSON.stringify(output));
  }
  
} catch (error: any) {
  // Tests not available or failed to run
  const output: StopHookOutput = {
    followup_message: `⚠️ Test runner failed: ${error.message}. Tests may not be configured.`,
  };
  console.log(JSON.stringify(output));
}
