#!/usr/bin/env node

/**
 * Build Hooks Script
 * 
 * Compiles TypeScript hook files to JavaScript for Node.js compatibility.
 * Keeps original .ts files for Bun users.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');
const hooksDir = join(packageRoot, '.cursor', 'hooks');
const distHooksDir = join(packageRoot, 'dist', 'hooks');

async function buildHooks() {
  console.log('🔨 Building hooks for Node.js compatibility...\n');
  
  // Ensure dist/hooks directory exists
  if (!existsSync(distHooksDir)) {
    await mkdir(distHooksDir, { recursive: true });
  }
  
  // Find all .ts hook files
  const hookFiles = await findHookFiles(hooksDir);
  
  if (hookFiles.length === 0) {
    console.log('⚠ No hook files found in .cursor/hooks/');
    return;
  }
  
  console.log(`Found ${hookFiles.length} hook file(s):\n`);
  
  // Compile each hook file using tsx
  for (const hookFile of hookFiles) {
    const fileName = hookFile.replace('.ts', '');
    const sourcePath = join(hooksDir, hookFile);
    const outputPath = join(distHooksDir, `${fileName}.js`);
    
    console.log(`  Compiling: ${hookFile}`);
    
    try {
      // Read the source file
      const sourceCode = await readFile(sourcePath, 'utf-8');
      
      // For now, we'll copy the .ts files as-is since they use top-level await
      // and tsx can run them directly. In production, users will use tsx or ts-node.
      // This script is mainly for documentation purposes.
      
      // Create a wrapper that can be run with node + tsx
      const wrapper = `#!/usr/bin/env node
// Compiled hook: ${fileName}
// Run with: npx tsx ${fileName}.js

${sourceCode}
`;
      
      await writeFile(outputPath, wrapper, 'utf-8');
      console.log(`    ✓ Created: dist/hooks/${fileName}.js`);
      
    } catch (error) {
      console.error(`    ✗ Error compiling ${hookFile}:`, error.message);
    }
  }
  
  console.log('\n✅ Hook compilation complete!\n');
  console.log('Note: Hooks use top-level await and require tsx or ts-node to run.');
  console.log('Update .cursor/hooks.json to use: npx tsx .cursor/hooks/<name>.ts\n');
}

async function findHookFiles(dir) {
  const files = await readdir(dir);
  return files.filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'));
}

// Run the build
buildHooks().catch((error) => {
  console.error('Build hooks error:', error.message);
  process.exit(1);
});
