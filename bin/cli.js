#!/usr/bin/env node

/**
 * Instructify CLI Entry Point
 * 
 * This is the executable wrapper that npm links to.
 * It imports and runs the compiled CLI tool.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import and run the CLI
const cliPath = join(__dirname, '../dist/cli/index.js');
const cliUrl = pathToFileURL(cliPath).href;

try {
  await import(cliUrl);
  // The compiled CLI runs automatically on import due to top-level main() call
} catch (error) {
  console.error('Error running Instructify CLI:', error.message);
  process.exit(1);
}
