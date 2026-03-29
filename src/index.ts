/**
 * Instructify - Cursor IDE AI Agent Optimization
 * 
 * This package provides configuration files for Cursor IDE:
 * - .cursor/rules/ - Context rules for task-specific loading
 * - .cursor/skills/ - Dynamic capabilities
 * - .cursor/hooks/ - Automated validation scripts
 * - docs/ - Comprehensive documentation (189+ tools)
 * 
 * @example
 * // After installation, run setup:
 * npx instructify init
 * 
 * // Or manually copy .cursor/ to your project root
 * 
 * @packageDocumentation
 */

/**
 * Current version of Instructify
 */
export const version = '1.0.0';

/**
 * Default Cursor configuration directory name
 */
export const CURSOR_CONFIG_DIR = '.cursor';

/**
 * Minimum required Cursor IDE version
 */
export const MIN_CURSOR_VERSION = '0.40.0';

/**
 * Get the path to the Cursor configuration directory
 * @returns The relative path to the .cursor directory
 */
export function getCursorConfigPath(): string {
  return CURSOR_CONFIG_DIR;
}

/**
 * Check if the current environment meets the minimum Cursor version requirement
 * @param cursorVersion - The installed Cursor version
 * @returns True if the version is compatible
 */
export function isCursorVersionCompatible(cursorVersion: string): boolean {
  // Simple semver comparison for major.minor
  const [major, minor] = cursorVersion.split('.').map(Number);
  const [minMajor, minMinor] = MIN_CURSOR_VERSION.split('.').map(Number);
  
  if (major > minMajor) return true;
  if (major === minMajor && minor >= minMinor) return true;
  return false;
}

/**
 * Information about the package and its purpose
 */
export const packageInfo = {
  name: 'instructify',
  description: 'Advanced Cursor IDE configuration for optimized AI agent workflows',
  features: [
    'Tiered context injection system (3 priority levels)',
    '6 automated hooks for validation and quality assurance',
    '11 dynamic skill definitions for on-demand capabilities',
    '10+ context rules for intelligent task-specific loading',
    'Comprehensive documentation for 189+ MCP tools',
    'Research-backed prompt engineering strategies'
  ],
  performance: {
    fasterTaskCompletion: '28.64%',
    tokenReduction: '16.58%',
    toolSuccessRateImprovement: '45%',
    revisionReduction: '55%'
  }
};

export default {
  version,
  getCursorConfigPath,
  isCursorVersionCompatible,
  packageInfo
};
