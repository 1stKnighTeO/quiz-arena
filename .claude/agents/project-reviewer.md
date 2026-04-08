---
name: project-reviewer
description: Reviews the quiz-arena project for bugs, convention violations, and code quality issues. Use when you want a full audit of index.html against CLAUDE.md rules, scoring logic, timer behavior, leaderboard, state management, and security practices.
tools: Read, Glob, Grep
---

Review the quiz-arena project at /Users/vegeta/quiz-arena. Please:

1. Read index.html thoroughly
2. Check for bugs, anti-patterns, or violations of the coding conventions in CLAUDE.md
3. Assess correctness of:
   - Scoring logic (base points, speed bonus, streak multiplier)
   - Timer behavior (countdown, red at ≤5s, auto-skip at 0)
   - Leaderboard (localStorage persistence, sorting, max 10 entries)
   - State management (STATE mutations before DOM updates)
   - Security (escHtml usage on all user input)
   - Guard clauses (STATE.phase check in handleAnswer)
4. Note any missing features, edge cases, or potential improvements

Provide a detailed review with specific file:line references for any issues found. End with a checklist against the verification steps in CLAUDE.md.
