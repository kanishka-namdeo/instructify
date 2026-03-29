#!/usr/bin/env node

/**
 * Instructify CLI Tool
 * 
 * Provides command-line interface for setting up Instructify configuration
 * in Cursor IDE projects.
 * 
 * Usage:
 *   npx instructify init    - Install .cursor/ configuration
 *   npx instructify --help  - Show help
 *   npx instructify --version - Show version
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { cp, rm, access } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '../..');

const VERSION = '1.0.0';

interface CLIOptions {
  help: boolean;
  version: boolean;
  force: boolean;
  verbose: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  return {
    help: args.includes('--help') || args.includes('-h'),
    version: args.includes('--version') || args.includes('-v'),
    force: args.includes('--force') || args.includes('-f'),
    verbose: args.includes('--verbose') || args.includes('-V')
  };
}

function showHelp() {
  console.log(`
🚀 Instructify - Cursor IDE AI Agent Optimization

Usage:
  npx instructify <command> [options]

Commands:
  init      Install .cursor/ configuration in current directory
  verify    Verify Cursor IDE installation and compatibility

Options:
  -h, --help      Show this help message
  -v, --version   Show version number
  -f, --force     Force overwrite existing .cursor/ directory
  -V, --verbose   Enable verbose output

Examples:
  npx instructify init              # Install configuration
  npx instructify init --force      # Force overwrite existing config
  npx instructify verify            # Check Cursor compatibility
  npx instructify --version         # Show version

Documentation:
  https://github.com/kanishka-namdeo/instructify

`);
}

function showVersion() {
  console.log(`instructify v${VERSION}`);
}

async function verifyCursorInstallation(): Promise<boolean> {
  const cursorPaths = [
    join(process.env.APPDATA || '', 'Cursor'),
    join(process.env.HOME || '', '.config', 'Cursor'),
    join(process.env.HOME || '', 'Library', 'Application Support', 'Cursor')
  ];
  
  for (const cursorPath of cursorPaths) {
    try {
      await access(cursorPath);
      console.log('✓ Cursor IDE installation detected');
      return true;
    } catch {
      continue;
    }
  }
  
  console.log('⚠ Cursor IDE installation not detected');
  console.log('  Download from: https://cursor.com');
  return false;
}

async function init(options: CLIOptions): Promise<void> {
  const targetDir = process.cwd();
  const sourcePath = join(packageRoot, '.cursor');
  const targetPath = join(targetDir, '.cursor');
  
  console.log('🚀 Instructify Setup\n');
  
  // Check if source exists
  if (!existsSync(sourcePath)) {
    console.error('❌ Error: .cursor/ directory not found in package');
    console.error('   This might be a packaging issue. Please report on GitHub.');
    process.exit(1);
  }
  
  // Check if target already exists
  if (existsSync(targetPath)) {
    if (!options.force) {
      console.log('⚠ .cursor/ already exists in current directory');
      console.log('  Use --force to overwrite existing configuration\n');
      
      // Show what would be overwritten
      try {
        const existingFiles = await countFiles(targetPath);
        console.log(`  Current .cursor/ contains ${existingFiles} files`);
      } catch {
        // Ignore if we can't count
      }
      
      console.log('\n  Options:');
      console.log('  - Backup and overwrite: npx instructify init --force');
      console.log('  - Manual installation: Copy .cursor/ from package manually');
      return;
    }
    
    console.log('📦 Backing up existing .cursor/ directory...');
    const backupPath = join(targetDir, `.cursor.backup.${Date.now()}`);
    try {
      await cp(targetPath, backupPath, { recursive: true });
      console.log(`✓ Backup created at: ${backupPath}`);
      await rm(targetPath, { recursive: true, force: true });
    } catch (error: any) {
      console.error(`❌ Error backing up: ${error.message}`);
      process.exit(1);
    }
  }
  
  console.log('📦 Installing Instructify configuration...');
  
  try {
    await cp(sourcePath, targetPath, { 
      recursive: true, 
      force: true,
      preserveTimestamps: true
    });
    
    const fileCount = await countFiles(targetPath);
    console.log(`✓ Copied ${fileCount} files to .cursor/`);
    
  } catch (error: any) {
    console.error(`❌ Error installing configuration: ${error.message}`);
    process.exit(1);
  }
  
  console.log('\n✅ Instructify configuration installed successfully!\n');
  console.log('📋 Next Steps:');
  console.log('  1. Restart Cursor IDE to activate the configuration');
  console.log('  2. Configure MCP servers in Cursor settings (if needed)');
  console.log('  3. Start coding with optimized AI assistance!\n');
  console.log('📚 Documentation: https://github.com/kanishka-namdeo/instructify\n');
  
  // Show quick start tips
  showQuickStart();
}

async function countFiles(dir: string): Promise<number> {
  try {
    const entries = await readdirRecursive(dir);
    return entries.length;
  } catch {
    // If we can't count, return estimate
    return 30; // Approximate number of files in .cursor/
  }
}

async function readdirRecursive(dir: string): Promise<string[]> {
  const { readdir } = await import('fs/promises');
  const { join } = await import('path');
  const { stat } = await import('fs/promises');
  
  const entries: string[] = [];
  const items = await readdir(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subEntries = await readdirRecursive(fullPath);
      entries.push(...subEntries);
    } else {
      entries.push(fullPath);
    }
  }
  
  return entries;
}

function showQuickStart() {
  console.log('💡 Quick Start Tips:');
  console.log('  • Try asking Cursor to "implement a React component"');
  console.log('  • Use Plan Mode for complex tasks');
  console.log('  • MCP servers provide 189+ specialized tools');
  console.log('  • Check .cursor/rules/ for task-specific optimizations\n');
}

async function main() {
  const args = process.argv.slice(2); // Get all arguments after 'node cli.js'
  const command = args[0];
  const options = parseArgs(args);
  
  // Show help if requested or no command provided
  if (options.help || !command) {
    showHelp();
    return;
  }
  
  if (options.version) {
    showVersion();
    return;
  }
  
  switch (command) {
    case 'init':
      await init(options);
      break;
    
    case 'verify':
      await verifyCursorInstallation();
      break;
    
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('\nRun "npx instructify --help" for usage information.');
      process.exit(1);
  }
}

main().catch((error: any) => {
  console.error('❌ Unexpected error:', error.message);
  if (process.env.DEBUG) {
    console.error(error);
  }
  process.exit(1);
});
