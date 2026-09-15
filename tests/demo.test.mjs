import assert from 'node:assert/strict';
import test from 'node:test';

import { dishes, initialApproved, offlineAnswer } from '../lib/demo.ts';

test('a chef-approved process step is retrieved with a version citation', () => {
  const approved = initialApproved();
  const result = offlineAnswer(
    'tomato',
    approved.tomato,
    dishes.tomato.questions[0].text,
  );
  assert.equal(result.grounded, true);
  assert.match(result.a2, /刚凝固先盛出/);
  assert.match(result.citation ?? '', /v1 · 第2条/);
  assert.notEqual(result.a0, result.a2);
});

test('the second process question retrieves the return-to-wok step', () => {
  const result = offlineAnswer(
    'tomato',
    initialApproved().tomato,
    dishes.tomato.questions[1].text,
  );
  assert.equal(result.found?.step, 4);
  assert.match(result.a2, /鸡蛋回锅/);
});

test('an explicit peanut fact is answered, but an unknown allergen is not guessed', () => {
  const approved = initialApproved().kungpao;
  const peanut = offlineAnswer('kungpao', approved, dishes.kungpao.questions[1].text);
  const sesame = offlineAnswer('kungpao', approved, dishes.kungpao.questions[2].text);
  assert.equal(peanut.grounded, true);
  assert.match(peanut.a2, /花生过敏者不应食用/);
  assert.equal(sesame.grounded, false);
  assert.equal(sesame.citation, null);
});

test('unapproved and unrecorded safety questions refuse instead of inventing facts', () => {
  const approved = initialApproved();
  const unapproved = offlineAnswer('pork', approved.pork, dishes.pork.questions[0].text);
  const salt = offlineAnswer('tomato', approved.tomato, dishes.tomato.questions[2].text);
  assert.equal(unapproved.grounded, false);
  assert.match(unapproved.a2, /没有主厨批准版/);
  assert.equal(salt.grounded, false);
  assert.match(salt.a2, /未记录/);
});

test('a chef-approved pork version can answer experience-based steps only', () => {
  const recipe = { version: 2, text: dishes.pork.approved, approvedAt: 'test' };
  const done = offlineAnswer('pork', recipe, dishes.pork.questions[0].text);
  const temp = offlineAnswer('pork', recipe, dishes.pork.questions[2].text);
  assert.equal(done.grounded, true);
  assert.match(done.a2, /筷子易扎入/);
  assert.match(done.citation ?? '', /v2/);
  assert.equal(temp.grounded, false);
});
