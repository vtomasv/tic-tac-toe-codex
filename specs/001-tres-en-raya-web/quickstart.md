# Quickstart and Validation Guide

This guide describes the intended validation workflow. Production files and tests are not created by
the planning phase.

## Prerequisites

- Node.js 24.18.0 LTS.
- npm supplied with the selected Node.js runtime.
- A Git repository. The current directory does not contain `.git`; this must be resolved before RED
  tasks and constitutional commits begin.
- Playwright browser binaries installed after dependency installation.

## Reproducible Setup

After setup tasks have created `package.json` and `package-lock.json`:

```bash
npm ci
npx playwright install
```

All direct dependencies are exact and the lockfile is authoritative. No network call is made by the
application or the traceability verifier.

## TDD Workflow per Criterion

1. Select the RED task and its AC-ID from `tasks.md` and `traceability.md`.
2. Add the exact planned test name containing that AC-ID.
3. Run the narrowest relevant command and record the expected failure as RED evidence.
4. Commit only the test using the constitutional `test(USn)` subject.
5. Execute the paired GREEN task through `/speckit-implement`.
6. Run the relevant suite until green and commit only the implementation with `feat(USn)` or
   `fix(USn)`.
7. Update the traceability row with task IDs, evidence and commit hashes.

## Required Final Commands

Run in this order:

```bash
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability
```

Expected final result: all commands exit 0. During planning—before tasks, tests, Git history and
commits exist—the final traceability command is expected to fail and must list missing links; this is
honest gate behavior, not a planning failure.

## Manual and E2E Scenarios

### Valid local game

- Start with nine empty cells and `Turno de X`.
- Alternate X and O on legal empty cells.
- Activate an occupied cell and confirm board, status and focus remain unchanged.

### Terminal results

- Validate each of the eight winning lines for X and O.
- Validate a ninth-cell draw without a winning line.
- Validate that a ninth-cell winning line resolves as victory before draw.
- In `WON_X`, `WON_O` and `DRAW`, activate every cell and confirm no mutation.

### Reset

- Reset from `PLAYING_X`, `PLAYING_O`, `WON_X`, `WON_O` and `DRAW`.
- Confirm nine empty cells, `PLAYING_X`, X announcement and focus on row 1, column 1.

### Keyboard and assistive contract

- Complete and reset a game using Tab, Enter and Space without a pointer.
- Confirm row-major focus order across all nine buttons, then reset.
- Confirm cell names include row, column and empty/X/O content.
- Confirm one polite status region updates for turn and terminal result.
- Confirm occupied/terminal cells are exposed unavailable yet remain focusable; reset remains enabled.

### Responsive and visual behavior

- Validate widths 320, 375, 768, 1280 and 1920 CSS pixels without horizontal overflow.
- At 200 % zoom, confirm no controls overlap.
- Confirm a continuous computed outline on focus and on hover of playable empty cells.
- Confirm X, O, turn and result remain distinguishable without color.
