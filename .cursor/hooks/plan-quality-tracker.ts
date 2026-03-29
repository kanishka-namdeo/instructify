// .cursor/hooks/plan-quality-tracker.ts
// Track plan vs actual execution metrics for continuous improvement

import { writeFileSync, readFileSync, existsSync } from "fs";
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

interface PlanMetrics {
  plan_accuracy: number; // % of plan followed exactly
  time_variance: number; // actual vs estimated time
  tool_usage: Record<string, number>; // tool frequency
  iteration_count: number; // /grind loops used
  blocker_count: number; // times BLOCKED
  timestamp: string;
  plan_type: string;
  mcp_usage: Record<string, number>; // MCP server frequency
  tool_efficiency: number; // cheap vs expensive tool ratio
  parallel_subagents: number; // count used
}

interface MCPEffectiveness {
  usage: number;
  success_rate: number;
}

const METRICS_FILE = join(process.cwd(), ".cursor/plan-metrics.json");

// Track MCP effectiveness (in production, would be persisted)
const mcpEffectiveness: Record<string, MCPEffectiveness> = {
  'cursor-ide-browser': { usage: 0, success_rate: 0 },
  'user-github': { usage: 0, success_rate: 0 },
  'user-ESLint': { usage: 0, success_rate: 0 },
  'user-context7': { usage: 0, success_rate: 0 }
};

// Read input from stdin
const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

console.error(`[Plan Tracker] Processing execution data...`);

// Load existing metrics
let allMetrics: PlanMetrics[] = [];
if (existsSync(METRICS_FILE)) {
  try {
    const content = readFileSync(METRICS_FILE, "utf-8");
    allMetrics = JSON.parse(content);
  } catch (error) {
    console.error("[Plan Tracker] Error loading metrics:", error);
    allMetrics = [];
  }
}

// Create new metric entry
const newMetric: PlanMetrics = {
  plan_accuracy: calculatePlanAccuracy(input),
  time_variance: 0, // Would be calculated from actual execution time
  tool_usage: {}, // Would be tracked during execution
  iteration_count: input.loop_count,
  blocker_count: input.status === "error" ? 1 : 0,
  timestamp: new Date().toISOString(),
  plan_type: "unknown", // Would be set based on plan content
  mcp_usage: {}, // Would track MCP server usage
  tool_efficiency: calculateToolEfficiency(), // Would calculate from tool usage
  parallel_subagents: 0 // Would count subagents used
};

// Add to metrics
allMetrics.push(newMetric);

// Save updated metrics
try {
  writeFileSync(METRICS_FILE, JSON.stringify(allMetrics, null, 2));
  console.error("[Plan Tracker] ✓ Metrics saved");
} catch (error) {
  console.error("[Plan Tracker] Error saving metrics:", error);
}

// Calculate rolling averages
const recentMetrics = allMetrics.slice(-10); // Last 10 plans
const avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.plan_accuracy, 0) / recentMetrics.length;
const avgIterations = recentMetrics.reduce((sum, m) => sum + m.iteration_count, 0) / recentMetrics.length;

console.error(`[Plan Tracker] Rolling averages (last 10 plans):`);
console.error(`  - Accuracy: ${avgAccuracy.toFixed(1)}%`);
console.error(`  - Avg iterations: ${avgIterations.toFixed(1)}`);

// Correlate MCP usage with success (in production, would use real data)
if (newMetric.mcp_usage && newMetric.mcp_usage['user-ESLint'] && newMetric.plan_accuracy > 85) {
  console.error("[Plan Tracker] ✓ ESLint MCP correlates with high accuracy");
}

const avgParallelSubagents = recentMetrics.reduce((sum, m) => sum + (m.parallel_subagents || 0), 0) / recentMetrics.length;
if (avgParallelSubagents > 2 && recentMetrics[recentMetrics.length - 1]?.time_variance < 20) {
  console.error("[Plan Tracker] ✓ Parallel exploration reduces time variance");
}

// Provide feedback based on metrics
if (input.status === "completed") {
  if (input.loop_count === 0) {
    console.error("[Plan Tracker] ✓ Perfect execution (no iterations needed)");
  } else if (input.loop_count <= 2) {
    console.error("[Plan Tracker] ✓ Good execution (minimal iterations)");
  } else {
    console.error("[Plan Tracker] ⚠ High iteration count - plan accuracy may need improvement");
  }
  
  // Suggest improvements if accuracy is low
  if (avgAccuracy < 70) {
    const output: StopHookOutput = {
      followup_message: "Plan accuracy has been below 70% recently. Consider:\n1. More thorough pre-plan research\n2. Better validation before execution\n3. More specific tool selection",
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

if (input.status === "error") {
  console.error("[Plan Tracker] ✗ Execution failed - analyzing patterns");
  
  // Check for recurring failures
  const recentFailures = recentMetrics.filter(m => m.blocker_count > 0).length;
  if (recentFailures > 2) {
    const output: StopHookOutput = {
      followup_message: "Multiple execution failures detected. Common causes:\n1. Insufficient research phase\n2. Missing validation steps\n3. Unrealistic time estimates\n\nWould you like to review the plan approach?",
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

// Default: stop without followup
console.log(JSON.stringify({}));
process.exit(0);

// Helper functions
function calculatePlanAccuracy(input: StopHookInput): number {
  // In production, this would:
  // - Compare planned steps vs actual execution
  // - Track deviations
  // - Calculate percentage match
  
  // For now, use loop count as proxy
  if (input.status !== "completed") return 0;
  if (input.loop_count === 0) return 100;
  if (input.loop_count <= 2) return 85;
  if (input.loop_count <= 5) return 70;
  return 50;
}

function calculateToolEfficiency(): number {
  // In production, this would:
  // - Calculate ratio of cheap vs expensive tools used
  // - Score: 100 = all Tier 1 tools, 0 = all Tier 4 tools
  // - Based on tool usage data from conversation
  
  // Placeholder: return neutral score
  return 75;
}
