# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**YACS** (Yet Another Codex Skills Repo) is a curated collection of reusable Skills for Codex. The skills cover a wide range of topics — from code quality and best practices to analysis of unconventional or unorthodox ideas.

## Repository Details

- **Remote:** https://github.com/munchkin09/YACS.git
- **Primary branch:** main
- **Platform:** Windows (case-insensitive filesystem, symlinks disabled, Git LFS configured)
- **Language:** Spanish may be used in documentation and skill descriptions

## Structure

```
skills/
  <category>/           # Thematic folder (e.g., code-quality, unorthodox-ideas)
    <skill-name>/       # One folder per skill
      skill.md          # Skill prompt/definition
      tools/            # Optional: helper scripts or tools
      ...               # Any other supporting files
```

- Each skill lives in its own folder inside a thematic category.
- A skill folder may contain just a `skill.md` or also include scripts, tools, and other assets.
- Category folders group skills by topic.
