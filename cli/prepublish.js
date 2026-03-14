#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const skillsDir = path.resolve(__dirname, 'skills');
const skillsSrcDir = path.resolve(__dirname, '..', 'skills');

// Remove existing skills directory
if (fs.existsSync(skillsDir)) {
  fs.rmSync(skillsDir, { recursive: true, force: true });
  console.log('✓ Removed old skills directory');
}

// Copy skills from parent directory
if (!fs.existsSync(skillsSrcDir)) {
  console.error('✗ Skills source directory not found:', skillsSrcDir);
  process.exit(1);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDir(skillsSrcDir, skillsDir);
  console.log('✓ Copied skills directory');
} catch (error) {
  console.error('✗ Failed to copy skills:', error.message);
  process.exit(1);
}
