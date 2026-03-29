// .cursor/hooks/plan-quality-tracker.ts
// Unified plan metrics tracking with real tool usage and accuracy calculations

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
  plan_accuracy: number;
  time_variance: number;
  tool_usage: Record<string, number>;
  iteration_count: number;
  blocker_count: number;
  timestamp: string;
  plan_type: string;
  mcp_usage: Record<string, number>;
  tool_efficiency: number;
  parallel_subagents: number;
  mcp_tools_used: string[];
  failed_tools: string[];
  conversation_duration_ms?: number;
}

interface MCPEffectiveness {
  usage: number;
  success_rate: number;
}

interface ToolCall {
  name: string;
  execution_time_ms?: number;
  success: boolean;
  mcp_server?: string;
}

interface HooksConfig {
  planTracking?: {
    trackMetrics?: boolean;
    accuracyThreshold?: number;
    efficiencyThreshold?: number;
    maxIterations?: number;
    provideFeedback?: boolean;
  };
}

const METRICS_FILE = join(process.cwd(), ".cursor/plan-metrics.json");
const CONVERSATIONS_DIR = join(process.cwd(), ".cursor/conversations");

// Load configuration
const configPath = join(process.cwd(), '.cursor/hooks.config.json');
const config: HooksConfig = existsSync(configPath) 
  ? JSON.parse(readFileSync(configPath, 'utf-8')) 
  : {};

const planTrackingConfig = {
  trackMetrics: config.planTracking?.trackMetrics !== false,
  accuracyThreshold: config.planTracking?.accuracyThreshold || 70,
  efficiencyThreshold: config.planTracking?.efficiencyThreshold || 60,
  maxIterations: config.planTracking?.maxIterations || 5,
  provideFeedback: config.planTracking?.provideFeedback !== false
};

// Read input from stdin
const stdin = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const input: StopHookInput = JSON.parse(stdin);

console.error(`[Plan Tracker] Processing execution data for conversation ${input.conversation_id}...`);

// Helper functions
function loadConversation(conversationId: string): any {
  const conversationPath = join(CONVERSATIONS_DIR, `${conversationId}.json`);
  if (!existsSync(conversationPath)) {
    console.error("[Plan Tracker] ⚠ Conversation file not found");
    return null;
  }
  
  try {
    return JSON.parse(readFileSync(conversationPath, 'utf-8'));
  } catch (error) {
    console.error("[Plan Tracker] Error loading conversation:", error);
    return null;
  }
}

function extractToolCalls(conversation: any): ToolCall[] {
  const tools: ToolCall[] = [];
  
  if (!conversation?.messages) return tools;
  
  for (const message of conversation.messages) {
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function?.name || 'unknown';
        
        // Determine if it's an MCP tool and which server
        let mcpServer: string | undefined;
        if (toolName.startsWith('browser_')) mcpServer = 'cursor-ide-browser';
        else if (toolName.startsWith('github_')) mcpServer = 'user-github';
        else if (toolName.includes('eslint')) mcpServer = 'user-ESLint';
        else if (toolName.includes('context7')) mcpServer = 'user-context7';
        else if (toolName.includes('chrome')) mcpServer = 'user-chrome-devtools';
        else if (toolName.includes('playwright')) mcpServer = 'user-playwright';
        else if (toolName.includes('selenium')) mcpServer = 'user-selenium';
        else if (toolName.includes('dart')) mcpServer = 'user-dart';
        else if (toolName.includes('stitch')) mcpServer = 'user-stitch';
        else if (toolName.includes('shadcn')) mcpServer = 'user-shadcn';
        
        tools.push({
          name: toolName,
          success: true, // Simplified - would check actual results in production
          mcp_server: mcpServer
        });
      }
    }
  }
  
  return tools;
}

function countParallelSubagents(conversation: any): number {
  if (!conversation?.messages) return 0;
  
  let count = 0;
  for (const message of conversation.messages) {
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        if (toolCall.function?.name === 'Task' || 
            toolCall.function?.name?.includes('subagent')) {
          count++;
        }
      }
    }
  }
  
  return count;
}

function detectPlanType(conversation: any): string {
  if (!conversation?.messages) return 'unknown';
  
  const conversationText = JSON.stringify(conversation.messages).toLowerCase();
  
  if (conversationText.includes('plan mode')) return 'plan-mode';
  if (conversationText.includes('browser') || conversationText.includes('web')) return 'browser-automation';
  if (conversationText.includes('github') || conversationText.includes('pr') || conversationText.includes('issue')) return 'github-ops';
  if (conversationText.includes('test')) return 'testing';
  if (conversationText.includes('refactor')) return 'refactoring';
  if (conversationText.includes('bug') || conversationText.includes('fix')) return 'bug-fix';
  if (conversationText.includes('feature') || conversationText.includes('implement')) return 'feature-development';
  
  return 'general';
}

function calculatePlanAccuracy(input: StopHookInput, conversation: any): number {
  if (input.status !== "completed") return 0;
  
  // Base accuracy on loop count (fewer iterations = higher accuracy)
  let baseAccuracy: number;
  if (input.loop_count === 0) baseAccuracy = 100;
  else if (input.loop_count <= 2) baseAccuracy = 85;
  else if (input.loop_count <= 5) baseAccuracy = 70;
  else baseAccuracy = 50;
  
  // Adjust based on tool usage patterns
  const tools = extractToolCalls(conversation);
  const failedTools = tools.filter(t => !t.success).length;
  
  if (failedTools > 0) {
    baseAccuracy -= (failedTools * 5); // Penalty for failed tools
  }
  
  return Math.max(0, Math.min(100, baseAccuracy));
}

function calculateToolEfficiency(tools: ToolCall[]): number {
  if (tools.length === 0) return 75; // Neutral score if no tools
  
  // Tier 1: Simple tools (Shell, Read, Write, Glob, Grep)
  // Tier 2: Analysis (ReadLints, SemanticSearch)
  // Tier 3: Complex (Task, WebSearch, WebFetch)
  // Tier 4: MCP tools
  
  const tierScores: Record<string, number> = {
    'Shell': 100, 'Read': 100, 'Write': 100, 'Glob': 100, 'Grep': 100,
    'ReadLints': 80, 'SemanticSearch': 80,
    'Task': 60, 'WebSearch': 60, 'WebFetch': 60,
  };
  
  let totalScore = 0;
  let toolCount = 0;
  
  for (const tool of tools) {
    if (tool.mcp_server) {
      totalScore += 40; // MCP tools are most expensive
      toolCount++;
    } else {
      const tierScore = tierScores[tool.name] || 75; // Default to middle tier
      totalScore += tierScore;
      toolCount++;
    }
  }
  
  return toolCount > 0 ? Math.round(totalScore / toolCount) : 75;
}

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

// Load conversation and extract data
const conversation = loadConversation(input.conversation_id);
const toolCalls = conversation ? extractToolCalls(conversation) : [];
const parallelSubagents = conversation ? countParallelSubagents(conversation) : 0;
const planType = conversation ? detectPlanType(conversation) : 'unknown';

// Track MCP usage
const mcpUsage: Record<string, number> = {};
const mcpToolsUsed: string[] = [];
const failedTools: string[] = [];

for (const tool of toolCalls) {
  if (tool.mcp_server) {
    mcpUsage[tool.mcp_server] = (mcpUsage[tool.mcp_server] || 0) + 1;
    if (!mcpToolsUsed.includes(tool.name)) {
      mcpToolsUsed.push(tool.name);
    }
  }
  
  if (!tool.success) {
    failedTools.push(tool.name);
  }
}

// Track general tool usage
const toolUsage: Record<string, number> = {};
for (const tool of toolCalls) {
  toolUsage[tool.name] = (toolUsage[tool.name] || 0) + 1;
}

// Create metric entry (used whether tracking is enabled or not)
const newMetric: PlanMetrics = {
  plan_accuracy: calculatePlanAccuracy(input, conversation),
  time_variance: 0,
  tool_usage: toolUsage,
  iteration_count: input.loop_count,
  blocker_count: input.status === "error" ? 1 : 0,
  timestamp: new Date().toISOString(),
  plan_type: planType,
  mcp_usage: mcpUsage,
  tool_efficiency: calculateToolEfficiency(toolCalls),
  parallel_subagents: parallelSubagents,
  mcp_tools_used: mcpToolsUsed,
  failed_tools: failedTools,
  conversation_duration_ms: undefined
};

// Save metric entry if tracking is enabled
if (planTrackingConfig.trackMetrics) {
  // Add to metrics
  allMetrics.push(newMetric);

  // Save updated metrics
  try {
    writeFileSync(METRICS_FILE, JSON.stringify(allMetrics, null, 2));
    console.error("[Plan Tracker] ✓ Metrics saved");
  } catch (error) {
    console.error("[Plan Tracker] Error saving metrics:", error);
  }
} else {
  console.error("[Plan Tracker] ⚠ Metrics tracking disabled in config");
}

// Calculate rolling averages (only if tracking is enabled)
let avgAccuracy = 75;
let avgIterations = 2;
let avgToolEfficiency = 75;
let avgParallelSubagents = 0;

if (planTrackingConfig.trackMetrics && allMetrics.length > 0) {
  const recentMetrics = allMetrics.slice(-10);
  avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.plan_accuracy, 0) / recentMetrics.length;
  avgIterations = recentMetrics.reduce((sum, m) => sum + m.iteration_count, 0) / recentMetrics.length;
  avgToolEfficiency = recentMetrics.reduce((sum, m) => sum + (m.tool_efficiency || 75), 0) / recentMetrics.length;
  avgParallelSubagents = recentMetrics.reduce((sum, m) => sum + (m.parallel_subagents || 0), 0) / recentMetrics.length;

  console.error(`[Plan Tracker] Rolling averages (last 10 plans):`);
  console.error(`  - Accuracy: ${avgAccuracy.toFixed(1)}%`);
  console.error(`  - Avg iterations: ${avgIterations.toFixed(1)}`);
  console.error(`  - Tool efficiency: ${avgToolEfficiency.toFixed(1)}`);
  console.error(`  - Avg parallel subagents: ${avgParallelSubagents.toFixed(1)}`);
}

// Analyze MCP effectiveness
const currentAccuracy = calculatePlanAccuracy(input, conversation);

if (Object.keys(mcpUsage).length > 0) {
  console.error(`[Plan Tracker] MCP tools used in this session: ${mcpToolsUsed.join(', ')}`);
  
  // Check correlation with success
  if (currentAccuracy > 85 && Object.keys(mcpUsage).length > 0) {
    console.error("[Plan Tracker] ✓ High accuracy with MCP tools - good tool selection");
  }
}

// Analyze parallel subagent usage
if (parallelSubagents > 0) {
  console.error(`[Plan Tracker] Used ${parallelSubagents} parallel subagent(s)`);
  
  if (parallelSubagents > 2 && currentAccuracy > 80) {
    console.error("[Plan Tracker] ✓ Parallel exploration appears effective");
  }
}

// Provide feedback based on metrics (if enabled)
if (planTrackingConfig.provideFeedback) {
  if (input.status === "completed") {
    if (input.loop_count === 0) {
      console.error("[Plan Tracker] ✓ Perfect execution (no iterations needed)");
    } else if (input.loop_count <= 2) {
      console.error("[Plan Tracker] ✓ Good execution (minimal iterations)");
    } else if (input.loop_count > planTrackingConfig.maxIterations) {
      console.error("[Plan Tracker] ⚠ High iteration count - plan accuracy may need improvement");
    }
    
    // Suggest improvements if accuracy is low
    if (avgAccuracy < planTrackingConfig.accuracyThreshold) {
      const output: StopHookOutput = {
        followup_message: `Plan accuracy has been below ${planTrackingConfig.accuracyThreshold}% recently. Consider:\n1. More thorough pre-plan research\n2. Better validation before execution\n3. More specific tool selection`,
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
    
    // Suggest tool efficiency improvements
    if (avgToolEfficiency < planTrackingConfig.efficiencyThreshold) {
      const output: StopHookOutput = {
        followup_message: "Tool efficiency has been low. Consider:\n1. Using simpler tools when possible (Tier 1: Shell, Read, Write)\n2. Avoiding expensive MCP calls for simple tasks\n3. Using 'fast' model for subagents",
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }

  if (input.status === "error") {
    console.error("[Plan Tracker] ✗ Execution failed - analyzing patterns");
    
    // Check for recurring failures
    if (planTrackingConfig.trackMetrics) {
      const recentFailures = allMetrics.slice(-10).filter(m => m.blocker_count > 0).length;
      if (recentFailures > 2) {
        const output: StopHookOutput = {
          followup_message: "Multiple execution failures detected. Common causes:\n1. Insufficient research phase\n2. Missing validation steps\n3. Unrealistic time estimates\n\nWould you like to review the plan approach?",
        };
        console.log(JSON.stringify(output));
        process.exit(0);
      }
    }
    
    // Check for tool-related failures
    if (failedTools.length > 0) {
      console.error(`[Plan Tracker] Failed tools: ${failedTools.join(', ')}`);
      const output: StopHookOutput = {
        followup_message: `Execution failed. Failed tools: ${failedTools.join(', ')}. Consider:\n1. Verifying tool prerequisites\n2. Using alternative tools\n3. Checking tool configuration`,
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }

  // Handle aborted execution (from plan-mode-monitor merge)
  if (input.status === "aborted") {
    console.error("[Plan Tracker] ⚠ Plan execution aborted by user");
    
    // Gather feedback
    if (input.loop_count < 2) {
      const output: StopHookOutput = {
        followup_message: "Plan execution aborted. What was the main issue?\n1. Plan was inaccurate\n2. Requirements changed\n3. Found better approach\n4. Other",
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }
} else {
  console.error("[Plan Tracker] ⚠ Feedback disabled in config");
}

// Default: stop without followup
console.log(JSON.stringify({}));
process.exit(0);
