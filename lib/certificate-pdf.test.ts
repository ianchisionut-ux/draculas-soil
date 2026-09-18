import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCertificatePdf } from './certificate-pdf';

test('creates a single-page PDF containing the unique order number', () => {
  const bytes = createCertificatePdf('DS-100234');
  const text = Buffer.from(bytes).toString('latin1');
  assert.ok(text.startsWith('%PDF-1.7'));
  assert.match(text, /\/Count 1/);
  assert.match(text, /ORDER DS-100234/);
  assert.ok(bytes.length > 500_000);
});
