# Quiz Arena

## Overview

Standalone vanilla JS quiz app. No npm install needed — zero external dependencies, uses Node.js built-in `http` module.

## Run

```
npm start      # http://localhost:3000
```

## Architecture

- `index.html` — entire app: HTML structure + CSS + JS in one file
- Three screens toggled with `.hidden`: `#screen-start`, `#screen-question`, `#screen-results`
- All runtime state in a single `STATE` object — mutate state first, then update DOM
- Questions defined in `const QUESTIONS` array at top of `<script>`

## Scoring Rules

- Base: 100 pts per correct answer
- Speed bonus: `timerRemaining × 5` pts (max +75 for instant answer)
- Streak multiplier: ×2 after 3 correct in a row, ×3 after 5
- Wrong answer or timeout: 0 pts, streak resets to 0

## Leaderboard

- Stored in `localStorage` key `quiz_leaderboard_v1`
- Shape: `[{ name, score, accuracy, timeSecs, date }]` sorted desc by score, max 10 entries
- Falls back to in-memory array if localStorage is unavailable (private browsing)

## Coding Conventions

- Vanilla JS only — no libraries, no frameworks, no CDN scripts
- Mutate `STATE` first, then update the DOM — never the other way around
- Always call `stopTimer()` as the first line of `handleAnswer()` to prevent double-fire
- Sanitize all user-supplied strings before inserting into DOM via `escHtml()`
- `STATE.timerInterval` holds the active interval ID; always clear it before starting a new one

## NEVER

- Do not use `prompt()` or `alert()` — use inline DOM elements instead
- Do not add external CDN scripts or stylesheets
- Do not mutate the `QUESTIONS` array directly — always shuffle a copy via `shuffle()`
- Do not skip the `STATE.phase !== 'playing'` guard in `handleAnswer()` — it prevents double-answer bugs
- Do not hardcode point values outside of `BASE_POINTS` and `TIMER_SECS` constants

## Verification

Open browser devtools Console — zero errors expected.

1. Timer counts down from 15, turns red at ≤5s, auto-skips on 0
2. 3 correct in a row → "×2 STREAK!" badge; 5 in a row → "×3 STREAK!"
3. Progress bar fills each question, reaches 100% on results screen
4. Results show correct score / accuracy % / elapsed time
5. Save score → entry appears in leaderboard table sorted by score desc
6. Reload page → leaderboard persists from localStorage
7. Responsive at mobile widths (< 480px): answers stack to 1 column
