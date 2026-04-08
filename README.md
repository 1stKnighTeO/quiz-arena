# Quiz Arena

A fast-paced, browser-based trivia game with a countdown timer, streak multipliers, confetti, and a persistent leaderboard. Zero dependencies — just Node.js and a browser.

## Features

- **15-second timer** per question — turns red and pulses at ≤5 s, auto-skips on timeout
- **Speed bonus** — answer faster to earn more points (up to +75 per question)
- **Streak multiplier** — ×2 after 3 correct in a row, ×3 after 5
- **Category select** — play all questions or focus on a single topic
- **Confetti** on every correct answer
- **Leaderboard** — top 10 scores persisted in `localStorage`, visible on the start screen and results screen

## Getting started

```
node --version   # requires Node.js ≥ 18
npm start        # serves the app at http://localhost:3000
```

No `npm install` needed — zero external dependencies.

## Scoring

| Component       | Value                          |
| --------------- | ------------------------------ |
| Base points     | 100 per correct answer         |
| Speed bonus     | `timerRemaining × 5` (max +75) |
| Streak ×2       | after 3 correct in a row       |
| Streak ×3       | after 5 correct in a row       |
| Wrong / timeout | 0 pts, streak resets           |

## Project structure

```
index.html          # entire app — HTML, CSS, and JS in one file
questions.json      # question bank loaded via /api/questions
server.js           # minimal Node.js HTTP server
tests/run.js        # automated unit tests (npm test)
```

## Questions

Questions live in `questions.json`. Each entry follows this shape:

```json
{
  "question": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correct": 2,
  "category": "Geography"
}
```

- `correct` is the zero-based index into `options`
- Every question must have exactly 4 options
- At least 2 distinct categories are required

## Testing

```
npm test
```

Runs `tests/run.js` — covers scoring logic, streak multipliers, shuffle safety, `escHtml` sanitization, leaderboard sort/cap/fallback, and `questions.json` schema validation.

Manual browser checks are listed in [CLAUDE.md](CLAUDE.md#verification).
