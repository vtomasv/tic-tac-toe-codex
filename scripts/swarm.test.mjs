import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = readFileSync(path.join(root, 'scripts', 'swarm.sh'), 'utf8');

test('GATE-SWARM-001 resolves launch-parallel prompts from the versioned root', () => {
  assert.match(script, /PROMPT_ROOT="\$ROOT\/\.prompts"/);
  assert.doesNotMatch(script, /PROMPT_ROOT="\$ROOT\/prompts"/);
  assert.equal(
    existsSync(path.join(root, '.prompts', '09-speckit-implement-domain.md')),
    true,
  );
  assert.equal(
    existsSync(path.join(root, '.prompts', '10-speckit-implement-interfaz.md')),
    true,
  );
});
