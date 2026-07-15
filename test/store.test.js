import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  createItem,
  readAll,
  readById,
  searchByField,
  updateItem,
  deleteItem,
} from '../src/store.js';

async function withTempDb(fn) {
  const dir = await mkdtemp(path.join(tmpdir(), 'json-crud-test-'));
  const dbPath = path.join(dir, 'db.json');
  try {
    await fn(dbPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('createItem은 자동 증가 id를 부여하고 저장한다', async () => {
  await withTempDb(async (dbPath) => {
    const first = await createItem({ name: '홍길동' }, dbPath);
    const second = await createItem({ name: '김철수' }, dbPath);
    assert.equal(first.id, 1);
    assert.equal(second.id, 2);
  });
});

test('readAll은 저장된 전체 목록을 반환한다', async () => {
  await withTempDb(async (dbPath) => {
    await createItem({ name: 'A' }, dbPath);
    await createItem({ name: 'B' }, dbPath);
    const items = await readAll(dbPath);
    assert.equal(items.length, 2);
  });
});

test('readById는 id로 단건을 조회하고, 없으면 null을 반환한다', async () => {
  await withTempDb(async (dbPath) => {
    const created = await createItem({ name: 'A' }, dbPath);
    const found = await readById(created.id, dbPath);
    assert.deepEqual(found, created);

    const notFound = await readById(999, dbPath);
    assert.equal(notFound, null);
  });
});

test('searchByField는 지정한 필드 값으로 검색한다', async () => {
  await withTempDb(async (dbPath) => {
    await createItem({ name: 'A', team: 'dev' }, dbPath);
    await createItem({ name: 'B', team: 'qa' }, dbPath);
    await createItem({ name: 'C', team: 'dev' }, dbPath);

    const devs = await searchByField('team', 'dev', dbPath);
    assert.equal(devs.length, 2);
    assert.ok(devs.every((item) => item.team === 'dev'));
  });
});

test('updateItem은 지정한 필드만 수정하고 id는 유지한다', async () => {
  await withTempDb(async (dbPath) => {
    const created = await createItem({ name: 'A', team: 'dev' }, dbPath);
    const updated = await updateItem(created.id, { team: 'qa' }, dbPath);
    assert.equal(updated.id, created.id);
    assert.equal(updated.name, 'A');
    assert.equal(updated.team, 'qa');
  });
});

test('updateItem은 존재하지 않는 id에 대해 null을 반환한다', async () => {
  await withTempDb(async (dbPath) => {
    const result = await updateItem(999, { name: 'X' }, dbPath);
    assert.equal(result, null);
  });
});

test('deleteItem은 데이터를 삭제하고 true를 반환한다', async () => {
  await withTempDb(async (dbPath) => {
    const created = await createItem({ name: 'A' }, dbPath);
    const result = await deleteItem(created.id, dbPath);
    assert.equal(result, true);

    const remaining = await readAll(dbPath);
    assert.equal(remaining.length, 0);
  });
});

test('deleteItem은 존재하지 않는 id에 대해 false를 반환한다', async () => {
  await withTempDb(async (dbPath) => {
    const result = await deleteItem(999, dbPath);
    assert.equal(result, false);
  });
});
