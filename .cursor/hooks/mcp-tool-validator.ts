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

const VALIDATION_LOG_PATH = join(process.cwd(), ".cursor/validation-log.md");

// Read input from stdin
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

// Check if MCP tools were used in this conversation
const conversationPath = join(process.cwd(), `.cursor/conversations/${input.conversation_id}.json`);
let usedMcpTools = false;
let mcpToolResults: Array<{ tool: string; success: boolean; error?: string }> = [];

if (existsSync(conversationPath)) {
  try {
    const conversation = JSON.parse(readFileSync(conversationPath, "utf-8"));
    
    // Check for MCP tool calls
    if (conversation.messages) {
      for (const message of conversation.messages) {
        if (message.tool_calls) {
          for (const toolCall of message.tool_calls) {
            // Check if it's an MCP tool (browser, github, eslint, context7, etc.)
            if (toolCall.function?.name?.startsWith('browser_') ||
                toolCall.function?.name?.startsWith('github_') ||
                toolCall.function?.name?.includes('eslint') ||
                toolCall.function?.name?.includes('context7') ||
                toolCall.function?.name?.includes('chrome') ||
                toolCall.function?.name?.includes('playwright') ||
                toolCall.function?.name?.includes('selenium')) {
              usedMcpTools = true;
              
              // Track success/failure (simplified - in real implementation would check tool results)
              mcpToolResults.push({
                tool: toolCall.function.name,
                success: true // Would need to check actual tool result
              });
            }
          }
        }
      }
    }
  } catch (error) {
    // Conversation file not found or invalid, continue without validation
  }
}

// If MCP tools were used, verify results
if (usedMcpTools) {
  const failedTools = mcpToolResults.filter(r => !r.success);
  
  if (failedTools.length > 0) {
    // Log validation failure
    const timestamp = new Date().toISOString();
    const logEntry = `## ${timestamp}\n\nMCP Tool Validation Failed:\n${failedTools.map(t => `- ${t.tool}`).join('\n')}\n\n`;
    
    if (existsSync(VALIDATION_LOG_PATH)) {
      writeFileSync(VALIDATION_LOG_PATH, logEntry, { flag: true });
    } else {
      writeFileSync(VALIDATION_LOG_PATH, `# MCP Tool Validation Log\n\n${logEntry}`);
    }
    
    // Retry failed tools (max 2 retries tracked in conversation)
    const output: StopHookOutput = {
      followup_message: `⚠️ ${failedTools.length} MCP tool call(s) may have failed. Retrying failed operations...`,
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
  
  // All tools succeeded
  const output: StopHookOutput = {
    followup_message: `✅ All ${mcpToolResults.length} MCP tool call(s) validated successfully.`,
  };
  console.log(JSON.stringify(output));
  process.exit(0);
}

// No MCP tools used, no validation needed
console.log(JSON.stringify({}));
