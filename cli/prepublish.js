#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// ── Skills ──────────────────────────────────────────────────────────────────
copyFile('skills');
// ── Agents ───────────────────────────────────────────────────────────────────
copyFile('agents');

function copyFile(folder) {
  const folderDir = path.resolve(__dirname, folder);
  const folderSrcDir = path.resolve(__dirname, '..', folder);

  if (fs.existsSync(folderDir)) {
    fs.rmSync(folderDir, { recursive: true, force: true });
    console.log(`✓ Removed old ${folderDir} directory`);
  }

  if (!fs.existsSync(folderSrcDir)) {
    console.error(`✗ ${folder} source directory not found:`, folderSrcDir);
    process.exit(1);
  }

  try {
    copyDir(folderSrcDir, folderDir);
    console.log(`✓ Copied ${folderDir} directory`);
  } catch (error) {
    console.error(`✗ Failed to copy ${folderDir}:`, error.message);
    process.exit(1);
  }
}
