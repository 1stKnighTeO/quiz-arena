#!/usr/bin/env node
'use strict'

const assert = require('assert')
const path = require('path')
const fs = require('fs')

// ── Test runner ──────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (e) {
    console.log(`  ✗ ${name}`)
    console.log(`    ${e.message}`)
    failed++
  }
}

function section(name) {
  console.log(`\n${name}`)
}

// ── Logic mirrored from index.html ───────────────────────────────────────────
const BASE_POINTS = 100
const TIMER_SECS = 15

function getMultiplier(streak) {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  return 1
}

function calcPoints(timerRemaining, streak) {
  return (BASE_POINTS + timerRemaining * 5) * getMultiplier(streak)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function escHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
}

function saveScore(existing, name, score, accuracy, timeSecs) {
  const entries = [...existing]
  entries.push({ name: name || 'Anonymous', score, accuracy, timeSecs, date: '' })
  entries.sort((a, b) => b.score - a.score)
  return entries.slice(0, 10)
}

// ── Scoring ───────────────────────────────────────────────────────────────────
section('Scoring')

test('instant correct answer: BASE_POINTS + TIMER_SECS × 5', () => {
  assert.strictEqual(calcPoints(TIMER_SECS, 0), 175)
})

test('correct answer mid-timer (10s left): 100 + 50 = 150', () => {
  assert.strictEqual(calcPoints(10, 0), 150)
})

test('correct at 0s remaining: exactly BASE_POINTS', () => {
  assert.strictEqual(calcPoints(0, 0), BASE_POINTS)
})

test('max speed bonus is TIMER_SECS × 5 = 75', () => {
  assert.strictEqual(TIMER_SECS * 5, 75)
})

// ── Streak multiplier ─────────────────────────────────────────────────────────
section('Streak Multiplier')

test('×1 at streak 0', () => assert.strictEqual(getMultiplier(0), 1))
test('×1 at streak 2', () => assert.strictEqual(getMultiplier(2), 1))
test('×2 at streak 3', () => assert.strictEqual(getMultiplier(3), 2))
test('×2 at streak 4', () => assert.strictEqual(getMultiplier(4), 2))
test('×3 at streak 5', () => assert.strictEqual(getMultiplier(5), 3))
test('×3 stays at streak 10', () => assert.strictEqual(getMultiplier(10), 3))

test('streak ×2 doubles the points', () => {
  const base = calcPoints(10, 0)
  const streak = calcPoints(10, 3)
  assert.strictEqual(streak, base * 2)
})

test('streak ×3 triples the points', () => {
  const base = calcPoints(10, 0)
  const streak = calcPoints(10, 5)
  assert.strictEqual(streak, base * 3)
})

// ── Shuffle ───────────────────────────────────────────────────────────────────
section('Shuffle')

test('returns all original elements', () => {
  const arr = [1, 2, 3, 4, 5]
  const result = shuffle(arr)
  assert.deepStrictEqual([...result].sort((a, b) => a - b), [...arr].sort((a, b) => a - b))
})

test('does not mutate the original array', () => {
  const arr = [1, 2, 3, 4]
  shuffle(arr)
  assert.deepStrictEqual(arr, [1, 2, 3, 4])
})

test('returns a new array reference', () => {
  const arr = [1, 2, 3]
  assert.notStrictEqual(shuffle(arr), arr)
})

// ── escHtml ───────────────────────────────────────────────────────────────────
section('escHtml')

test('escapes &', () => assert.strictEqual(escHtml('a&b'), 'a&amp;b'))
test('escapes <', () => assert.strictEqual(escHtml('<script>'), '&lt;script&gt;'))
test('escapes >', () => assert.strictEqual(escHtml('a>b'), 'a&gt;b'))
test('escapes double quotes', () => assert.strictEqual(escHtml('"hi"'), '&quot;hi&quot;'))
test('escapes single quotes', () => assert.strictEqual(escHtml("it's"), 'it&#39;s'))
test('leaves safe strings unchanged', () => assert.strictEqual(escHtml('Hello World'), 'Hello World'))
test('handles all special chars together', () => {
  assert.strictEqual(escHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;')
})

// ── Leaderboard ───────────────────────────────────────────────────────────────
section('Leaderboard')

test('sorted by score descending', () => {
  const board = saveScore([], 'Alice', 500, 80, 60)
  const board2 = saveScore(board, 'Bob', 1000, 90, 45)
  assert.strictEqual(board2[0].name, 'Bob')
  assert.strictEqual(board2[1].name, 'Alice')
})

test('capped at 10 entries', () => {
  let board = []
  for (let i = 0; i < 15; i++) board = saveScore(board, `P${i}`, i * 100, 50, 30)
  assert.strictEqual(board.length, 10)
})

test('top 10 keeps highest scores', () => {
  let board = []
  for (let i = 1; i <= 15; i++) board = saveScore(board, `P${i}`, i * 100, 50, 30)
  assert.strictEqual(board[0].score, 1500)
  assert.strictEqual(board[9].score, 600)
})

test('falls back to "Anonymous" when name is empty', () => {
  const board = saveScore([], '', 100, 50, 30)
  assert.strictEqual(board[0].name, 'Anonymous')
})

// ── Questions data ────────────────────────────────────────────────────────────
section('Questions (questions.json)')

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'questions.json'), 'utf8'),
)

test('questions.json is a non-empty array', () => {
  assert.ok(Array.isArray(questions))
  assert.ok(questions.length > 0)
})

test('every question has required fields', () => {
  questions.forEach((q, i) => {
    assert.ok(typeof q.question === 'string' && q.question.length > 0, `q[${i}] missing question`)
    assert.ok(Array.isArray(q.options), `q[${i}] missing options`)
    assert.ok(typeof q.correct === 'number', `q[${i}] correct is not a number`)
    assert.ok(typeof q.category === 'string' && q.category.length > 0, `q[${i}] missing category`)
  })
})

test('every question has exactly 4 options', () => {
  questions.forEach((q, i) => {
    assert.strictEqual(q.options.length, 4, `q[${i}] has ${q.options.length} options`)
  })
})

test('correct index is within 0–3', () => {
  questions.forEach((q, i) => {
    assert.ok(q.correct >= 0 && q.correct <= 3, `q[${i}] correct=${q.correct} out of range`)
  })
})

test('no duplicate question text', () => {
  const texts = questions.map((q) => q.question)
  const unique = new Set(texts)
  assert.strictEqual(unique.size, texts.length, 'duplicate question found')
})

test('at least 2 distinct categories', () => {
  const cats = new Set(questions.map((q) => q.category))
  assert.ok(cats.size >= 2, `only ${cats.size} category`)
})

test('each category has at least 1 question', () => {
  const cats = [...new Set(questions.map((q) => q.category))]
  cats.forEach((cat) => {
    const count = questions.filter((q) => q.category === cat).length
    assert.ok(count >= 1, `category "${cat}" has no questions`)
  })
})

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.log('\nManual checks still needed (browser-only):')
  console.log('  • Timer turns red at ≤5s, auto-skips on 0')
  console.log('  • Streak badge appears / disappears correctly')
  console.log('  • Progress bar reaches 100% on results screen')
  console.log('  • Confetti fires on correct answer')
  console.log('  • Leaderboard persists after page reload (localStorage)')
  console.log('  • Responsive layout at <480px')
  process.exit(1)
}
console.log('\nManual checks still needed (browser-only):')
console.log('  • Timer turns red at ≤5s, auto-skips on 0')
console.log('  • Streak badge appears / disappears correctly')
console.log('  • Progress bar reaches 100% on results screen')
console.log('  • Confetti fires on correct answer')
console.log('  • Leaderboard persists after page reload (localStorage)')
console.log('  • Responsive layout at <480px')
