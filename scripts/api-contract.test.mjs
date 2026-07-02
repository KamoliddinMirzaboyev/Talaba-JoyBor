import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const apiSource = await readFile(resolve('src/services/api.ts'), 'utf8');
const baseUrlMatch = apiSource.match(/API_BASE_URL\s*=\s*['"]([^'"]+)['"]/);

assert.ok(baseUrlMatch, 'API_BASE_URL export was not found in src/services/api.ts');

const baseUrl = baseUrlMatch[1].replace(/\/+$/, '');

async function assertEndpointOk(endpoint) {
  const response = await fetch(`${baseUrl}${endpoint}`);
  assert.equal(
    response.status,
    200,
    `${baseUrl}${endpoint} should return 200, got ${response.status}`
  );
}

await assertEndpointOk('/stats/');
await assertEndpointOk('/dormitories/');

const loginSource = await readFile(resolve('src/pages/LoginPage.tsx'), 'utf8');

assert.equal(
  /localStorage\.setItem\(['"]access['"]/.test(loginSource),
  false,
  'LoginPage should not store access token in localStorage'
);

assert.equal(
  /localStorage\.setItem\(['"]refresh['"]/.test(loginSource),
  false,
  'LoginPage should not store refresh token in localStorage'
);

console.log('Talaba API contract checks passed.');
