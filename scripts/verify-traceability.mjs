#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const AC_PATTERN = /^AC-US\d+-[A-Z0-9]+-\d{3}$/;
const GATE_PATTERN = /^GATE-[A-Z0-9]+-\d{3}$/;
const TASK_PATTERN = /^T\d{3}$/;
const PHASES = new Set(['plan', 'tasks', 'final']);

function unique(values) {
  return [...new Set(values)];
}

function sameValues(left, right) {
  return [...new Set(left)].sort().join('\n') === [...new Set(right)].sort().join('\n');
}

function markdownCells(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function stripCode(value) {
  return value.replaceAll('`', '').trim();
}

function parseSpec(content, errors) {
  const ids = [];
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const candidate = line.match(/^- \*\*(AC-[^*]+)\*\*/)?.[1];
    if (!candidate) continue;
    if (!AC_PATTERN.test(candidate)) {
      errors.push(`[spec] line ${index + 1}: malformed AC-ID ${candidate}`);
      continue;
    }
    if (ids.includes(candidate)) errors.push(`[spec] line ${index + 1}: duplicate AC-ID ${candidate}`);
    ids.push(candidate);
  }
  if (ids.length === 0) errors.push('[spec] no anchored acceptance criteria found');
  return unique(ids);
}

function parseLabel(line, name, pattern, errors, taskId) {
  const raw = line.match(new RegExp(`\\[${name}:([^\\]]+)\\]`))?.[1];
  if (!raw) return [];
  const refs = raw.split(',').map((value) => value.trim()).filter(Boolean);
  for (const ref of refs) {
    if (!pattern.test(ref)) errors.push(`[tasks] ${taskId}: malformed ${name} reference ${ref}`);
  }
  return refs;
}

function validateExpectedCommit(task, errors) {
  if (!task.phase) return;
  const subject = task.line.match(/Expected commit: `([^`]+)`/)?.[1];
  if (!subject) {
    errors.push(`[tasks] ${task.id}: missing expected commit subject`);
    return;
  }
  const type = task.phase === 'RED' ? 'test' : '(?:feat|fix)';
  if (task.gates.length > 0) {
    const expected = new RegExp(`^${type}\\(tooling\\): ${task.id} .+ \\[${task.gates.join(' ')}\\]$`);
    if (!expected.test(subject) || task.story || task.acs.length > 0) {
      errors.push(`[tasks] ${task.id}: invalid tooling commit subject or fabricated US/AC reference`);
    }
    return;
  }
  if (!task.story) return;
  const expected = new RegExp(`^${type}\\(${task.story}\\): ${task.id} .+ \\[${task.acs.join(' ')}\\]$`);
  if (!expected.test(subject)) errors.push(`[tasks] ${task.id}: invalid product commit subject`);
}

function parseTasks(content, errors) {
  const tasks = [];
  const seen = new Set();
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const match = line.match(/^- \[[ xX]\] (T\d{3})\b/);
    if (!match) continue;
    const id = match[1];
    if (seen.has(id)) errors.push(`[tasks] line ${index + 1}: duplicate task ID ${id}`);
    seen.add(id);
    const storyNumber = line.match(/\[US(\d+)\]/)?.[1];
    const task = {
      id,
      index,
      line,
      story: storyNumber ? `US${storyNumber}` : null,
      phase: line.includes('[RED]') ? 'RED' : line.includes('[GREEN]') ? 'GREEN' : null,
      acs: parseLabel(line, 'AC', AC_PATTERN, errors, id),
      gates: parseLabel(line, 'GATE', GATE_PATTERN, errors, id),
      shared: line.includes('[SHARED]'),
    };
    if (task.story && task.acs.length === 0) errors.push(`[tasks] ${id}: user-story task missing [AC:...]`);
    if (task.story && !task.shared) {
      const prefix = `AC-${task.story}-`;
      for (const ac of task.acs) {
        if (!ac.startsWith(prefix)) errors.push(`[tasks] ${id}: ${ac} does not belong to ${task.story}`);
      }
    }
    if (task.shared) {
      const stories = unique(task.acs.map((ac) => ac.match(/^AC-(US\d+)-/)?.[1]).filter(Boolean));
      if (task.phase !== 'GREEN' || !task.story || stories.length < 2 || !stories.includes(task.story)) {
        errors.push(`[tasks] ${id}: [SHARED] requires a GREEN task with related ACs from its primary story and at least one other story`);
      }
    }
    if (task.gates.length > 0 && !task.phase) errors.push(`[tasks] ${id}: gate task missing RED/GREEN phase`);
    validateExpectedCommit(task, errors);
    tasks.push(task);
  }
  return tasks;
}

function parseLedger(content, errors) {
  const acRows = new Map();
  const gateRows = new Map();
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (line.startsWith('| AC-')) {
      const cells = markdownCells(line);
      const id = cells[0];
      if (id === 'AC-ID') continue;
      if (!AC_PATTERN.test(id)) {
        errors.push(`[ledger] line ${index + 1}: malformed AC-ID ${id}`);
        continue;
      }
      if (acRows.has(id)) errors.push(`[ledger] line ${index + 1}: duplicate AC row ${id}`);
      acRows.set(id, {
        id,
        red: cells[1],
        green: cells[2],
        level: cells[3],
        files: cells[4],
        testName: stripCode(cells[5]),
        evidence: cells[6],
        testCommit: cells[7],
        implementationCommit: cells[8],
        status: cells[9],
      });
    }
    if (line.startsWith('| GATE-')) {
      const cells = markdownCells(line);
      const id = cells[0];
      if (id === 'GATE-ID') continue;
      if (!GATE_PATTERN.test(id)) {
        errors.push(`[ledger] line ${index + 1}: malformed GATE-ID ${id}`);
        continue;
      }
      if (gateRows.has(id)) errors.push(`[ledger] line ${index + 1}: duplicate gate row ${id}`);
      gateRows.set(id, {
        id,
        red: cells[1],
        green: cells[2],
        files: cells[3],
        evidence: cells[4],
        testCommit: cells[5],
        implementationCommit: cells[6],
        status: cells[7],
      });
    }
  }
  return { acRows, gateRows };
}

function tasksFor(tasks, field, ref, phase) {
  return tasks.filter((task) => task.phase === phase && task[field].includes(ref));
}

function validateTaskPair(ref, field, tasks, row, errors) {
  const red = tasksFor(tasks, field, ref, 'RED');
  const green = tasksFor(tasks, field, ref, 'GREEN');
  if (red.length === 0) errors.push(`[tasks] missing RED task for ${ref}`);
  if (green.length === 0) errors.push(`[tasks] missing GREEN task for ${ref}`);
  if (red.length > 0 && green.length > 0 && Math.min(...green.map((task) => task.index)) < Math.min(...red.map((task) => task.index))) {
    errors.push(`[tasks] GREEN precedes RED for ${ref}`);
  }
  if (!row) return;
  if (!TASK_PATTERN.test(row.red) || !red.some((task) => task.id === row.red)) {
    errors.push(`[ledger] ${ref}: RED task ${row.red} is missing or does not reference the ID`);
  }
  if (!TASK_PATTERN.test(row.green) || !green.some((task) => task.id === row.green)) {
    errors.push(`[ledger] ${ref}: GREEN task ${row.green} is missing or does not reference the ID`);
  }
}

function validateCohesiveBlocks(tasks, acRows, errors) {
  let pending = [];
  for (const task of tasks) {
    if (!task.story || !task.phase) continue;
    if (task.phase === 'RED') {
      pending.push(task.id);
      continue;
    }

    const expected = unique(
      task.acs
        .map((ac) => acRows.get(ac)?.red)
        .filter((id) => typeof id === 'string'),
    );
    if (!sameValues(pending, expected)) {
      errors.push(
        `[tasks] ${task.id}: unrelated RED block is open; expected ${expected.join(', ') || 'none'}, found ${pending.join(', ') || 'none'}`,
      );
    }
    pending = [];
  }
  if (pending.length > 0) {
    errors.push(`[tasks] unrelated RED block remains open: ${pending.join(', ')}`);
  }
}

export function validateSnapshot({ spec, tasks, ledger, phase = 'tasks' }) {
  const errors = [];
  if (!PHASES.has(phase)) errors.push(`[config] unsupported phase ${phase}`);
  const acIds = parseSpec(spec, errors);
  const parsedTasks = parseTasks(tasks, errors);
  const parsedLedger = parseLedger(ledger, errors);
  const canonical = new Set(acIds);

  for (const ac of acIds) {
    if (!parsedLedger.acRows.has(ac)) errors.push(`[ledger] missing row for ${ac}`);
  }
  for (const ac of parsedLedger.acRows.keys()) {
    if (!canonical.has(ac)) errors.push(`[ledger] unknown AC-ID ${ac}`);
  }

  if (phase !== 'plan') {
    for (const task of parsedTasks) {
      for (const ac of task.acs) if (!canonical.has(ac)) errors.push(`[tasks] ${task.id}: unknown AC-ID ${ac}`);
    }
    for (const ac of acIds) validateTaskPair(ac, 'acs', parsedTasks, parsedLedger.acRows.get(ac), errors);
    validateCohesiveBlocks(parsedTasks, parsedLedger.acRows, errors);
    if (parsedLedger.gateRows.size === 0) errors.push('[ledger] missing foundational quality gate row');
    for (const [gate, row] of parsedLedger.gateRows) validateTaskPair(gate, 'gates', parsedTasks, row, errors);
    for (const task of parsedTasks) {
      for (const gate of task.gates) {
        if (!parsedLedger.gateRows.has(gate)) errors.push(`[tasks] ${task.id}: unknown GATE-ID ${gate}`);
      }
    }
  }

  return {
    errors: unique(errors).sort(),
    counts: {
      acceptanceCriteria: acIds.length,
      tasks: parsedTasks.length,
      redTasks: parsedTasks.filter((task) => task.phase === 'RED').length,
      greenTasks: parsedTasks.filter((task) => task.phase === 'GREEN').length,
      gates: parsedLedger.gateRows.size,
    },
    model: { tasks: parsedTasks, ...parsedLedger },
  };
}

function parseArgs(argv) {
  let phase = 'final';
  let root = process.cwd();
  for (const argument of argv) {
    if (argument.startsWith('--phase=')) phase = argument.slice('--phase='.length);
    else if (argument.startsWith('--root=')) root = path.resolve(argument.slice('--root='.length));
    else throw new Error(`unknown argument ${argument}`);
  }
  if (!PHASES.has(phase)) throw new Error(`unsupported phase ${phase}`);
  return { phase, root };
}

function readRequired(file, group, errors) {
  if (!existsSync(file)) {
    errors.push(`[${group}] missing file ${file}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

function resolveFeatureDir(root, errors) {
  const featureFile = path.join(root, '.specify', 'feature.json');
  const raw = readRequired(featureFile, 'config', errors);
  if (!raw) return root;
  try {
    const value = JSON.parse(raw).feature_directory;
    if (typeof value !== 'string' || value.length === 0) throw new Error('feature_directory is missing');
    return path.resolve(root, value);
  } catch (error) {
    errors.push(`[config] invalid .specify/feature.json: ${error.message}`);
    return root;
  }
}

function splitLedgerFiles(value) {
  return value.split(';').map(stripCode).filter(Boolean);
}

function declaredTestTitles(content) {
  const titles = [];
  const pattern = /\b(?:test|it)\s*\(\s*(['"`])([^'"`\n]+)\1/g;
  for (const match of content.matchAll(pattern)) titles.push(match[2]);
  return titles;
}

function validateFinalFiles(root, featureDir, result, errors) {
  for (const row of result.model.acRows.values()) {
    if (row.evidence === 'PENDING' || row.evidence.length === 0) errors.push(`[ledger] ${row.id}: missing RED evidence`);
    if (row.testCommit === 'PENDING') errors.push(`[ledger] ${row.id}: missing test commit`);
    if (row.implementationCommit === 'PENDING') errors.push(`[ledger] ${row.id}: missing implementation commit`);
    if (row.status !== 'VERIFIED') errors.push(`[ledger] ${row.id}: status must be VERIFIED`);
    for (const relativeFile of splitLedgerFiles(row.files)) {
      const file = path.join(root, relativeFile);
      const content = readRequired(file, 'tests', errors);
      if (content && !declaredTestTitles(content).includes(row.testName)) {
        errors.push(`[tests] ${row.id}: exact test name not declared in ${relativeFile}`);
      }
    }
  }
  for (const row of result.model.gateRows.values()) {
    if (row.evidence === 'PENDING' || row.evidence.length === 0) errors.push(`[ledger] ${row.id}: missing RED evidence`);
    if (row.testCommit === 'PENDING') errors.push(`[ledger] ${row.id}: missing test commit`);
    if (row.implementationCommit === 'PENDING') errors.push(`[ledger] ${row.id}: missing implementation commit`);
    if (row.status !== 'VERIFIED') errors.push(`[ledger] ${row.id}: status must be VERIFIED`);
    for (const relativeFile of splitLedgerFiles(row.files)) readRequired(path.join(root, relativeFile), 'tests', errors);
  }

  const packageFile = path.join(root, 'package.json');
  const packageContent = readRequired(packageFile, 'config', errors);
  if (packageContent) {
    try {
      const command = JSON.parse(packageContent).scripts?.['verify:traceability'];
      if (command !== 'node scripts/verify-traceability.mjs --phase=final') {
        errors.push('[config] package.json has an invalid verify:traceability command');
      }
    } catch (error) {
      errors.push(`[config] invalid package.json: ${error.message}`);
    }
  }
  validateGit(root, result, errors);
}

function subjectRefs(subject, prefix) {
  const bracket = subject.match(/\[([^\]]+)\]$/)?.[1] ?? '';
  return bracket.split(/\s+/).filter((value) => value.startsWith(prefix));
}

function validateGit(root, result, errors) {
  const git = spawnSync('git', ['log', '--format=%H%x09%s', '--all'], { cwd: root, encoding: 'utf8' });
  if (git.status !== 0) {
    errors.push('[git] unable to read git log');
    return;
  }
  const commits = new Map(
    git.stdout.split(/\r?\n/).filter(Boolean).map((line) => {
      const separator = line.indexOf('\t');
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
  );
  const taskById = new Map(result.model.tasks.map((task) => [task.id, task]));
  for (const [hash, subject] of commits) {
    const product = subject.match(/^(test|feat|fix)\(US\d+\): (T\d{3}) .+ \[AC-[^\]]+\]$/);
    const tooling = subject.match(/^(test|feat|fix)\(tooling\): (T\d{3}) .+ \[GATE-[^\]]+\]$/);
    const match = product ?? tooling;
    if (!match) continue;
    const task = taskById.get(match[2]);
    if (!task) {
      errors.push(`[git] ${hash}: subject references unknown task ${match[2]}`);
      continue;
    }
    const actual = product ? subjectRefs(subject, 'AC-') : subjectRefs(subject, 'GATE-');
    const expected = product ? task.acs : task.gates;
    if (!sameValues(actual, expected)) errors.push(`[git] ${hash}: subject references do not match ${task.id}`);
  }
  for (const row of [...result.model.acRows.values(), ...result.model.gateRows.values()]) {
    if (row.testCommit === 'PENDING' || row.implementationCommit === 'PENDING') continue;
    if (!commits.has(row.testCommit)) errors.push(`[git] ${row.id}: unknown test commit ${row.testCommit}`);
    if (!commits.has(row.implementationCommit)) errors.push(`[git] ${row.id}: unknown implementation commit ${row.implementationCommit}`);
    if (commits.has(row.testCommit) && commits.has(row.implementationCommit)) {
      try {
        execFileSync('git', ['merge-base', '--is-ancestor', row.testCommit, row.implementationCommit], {
          cwd: root,
          stdio: 'ignore',
        });
      } catch {
        errors.push(`[git] ${row.id}: test commit is not an ancestor of implementation commit`);
      }
    }
  }
}

function printErrors(errors) {
  const groups = new Map();
  for (const error of unique(errors).sort()) {
    const group = error.match(/^\[([^\]]+)\]/)?.[1] ?? 'general';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(error.replace(/^\[[^\]]+\]\s*/, ''));
  }
  for (const [group, messages] of [...groups.entries()].sort()) {
    console.error(`${group}:`);
    for (const message of messages) console.error(`  - ${message}`);
  }
}

export function runCli(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`config:\n  - ${error.message}`);
    return 1;
  }
  const errors = [];
  const featureDir = resolveFeatureDir(options.root, errors);
  const spec = readRequired(path.join(featureDir, 'spec.md'), 'spec', errors);
  const tasks = readRequired(path.join(featureDir, 'tasks.md'), 'tasks', errors);
  const ledger = readRequired(path.join(featureDir, 'traceability.md'), 'ledger', errors);
  const result = validateSnapshot({ spec, tasks, ledger, phase: options.phase });
  errors.push(...result.errors);
  if (options.phase === 'final') validateFinalFiles(options.root, featureDir, result, errors);
  if (errors.length > 0) {
    printErrors(errors);
    return 1;
  }
  console.log(
    `Traceability ${options.phase} PASS: ${result.counts.acceptanceCriteria} ACs, ` +
      `${result.counts.gates} gates, ${result.counts.redTasks} RED tasks, ` +
      `${result.counts.greenTasks} GREEN tasks.`,
  );
  return 0;
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) process.exitCode = runCli();
