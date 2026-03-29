// .cursor/hooks/plan-mode-monitor.ts
// Monitor plan execution quality and provide feedback

export {};

interface StopHookInput {
  conversation_id: string;
  status: "completed" | "aborted" | "error";
  loop_count: number;
}

interface StopHookOutput {
  followup_message?: string;
}

interface ToolUsage {
  tool_name: string;
  execution_time_ms: number;
  success: boolean;
  mcp_server?: string;
}

// Read input from stdin
const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

// Log hook execution
console.error(`[Plan Monitor] Status: ${input.status}, Loop: ${input.loop_count}`);

// Track tool usage patterns (in production, would be persisted)
const toolUsage: ToolUsage[] = [];

// Analyze patterns and provide feedback
const expensiveTools = toolUsage.filter(t => t.execution_time_ms > 5000);
const failedTools = toolUsage.filter(t => !t.success);

// Track plan accuracy
if (input.status === "completed") {
  // Log successful plan execution
  // In production, this would:
  // - Update plan accuracy metrics
  // - Learn from successful patterns
  // - Adjust time estimates
  // - Refine tool selection heuristics
  
  console.error("[Plan Monitor] ✓ Plan completed successfully");
  
  // Optional: Continue monitoring for quality patterns
  if (input.loop_count < 3) {
    const output: StopHookOutput = {
      followup_message: "Plan execution completed. Consider rating plan accuracy to improve future estimates.",
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

// Track failure patterns
if (input.status === "error") {
  // Analyze failure reason
  // In production, this would:
  // - Log failure type
  // - Update plan validation rules
  // - Suggest improvements
  // - Flag high-risk patterns
  
  console.error("[Plan Monitor] ✗ Plan execution failed");
  
  // Provide feedback on slow tools
  if (expensiveTools.length > 3) {
    const output: StopHookOutput = {
      followup_message: "⚠️ Multiple slow tools detected. Consider:\n1. Using 'fast' model for subagents\n2. Narrowing target_directories\n3. Using cheaper alternative tools",
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
  
  const output: StopHookOutput = {
    followup_message: "Plan execution encountered an error. Would you like to:\n1. Analyze the failure\n2. Try alternative approach\n3. Create updated plan",
  };
  console.log(JSON.stringify(output));
  process.exit(0);
}

// Handle aborted execution
if (input.status === "aborted") {
  console.error("[Plan Monitor] ⚠ Plan execution aborted by user");
  
  // Optional: Gather feedback
  if (input.loop_count < 2) {
    const output: StopHookOutput = {
      followup_message: "Plan execution aborted. What was the main issue?\n1. Plan was inaccurate\n2. Requirements changed\n3. Found better approach\n4. Other",
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

// Default: stop monitoring
console.log(JSON.stringify({}));
process.exit(0);
