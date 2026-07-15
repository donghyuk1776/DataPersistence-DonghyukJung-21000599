import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import {
  createItem,
  readAll,
  readById,
  searchByField,
  updateItem,
  deleteItem,
} from './store.js';

const rl = readline.createInterface({ input: stdin, output: stdout });

function printMenu() {
  console.log(`
===== JSON CRUD 콘솔 애플리케이션 =====
1. Create - 데이터 추가
2. Read   - 전체 목록 보기
3. Read   - ID로 검색
4. Read   - 필드 값으로 검색
5. Update - 데이터 수정
6. Delete - 데이터 삭제
0. 종료
========================================`);
}

function printItems(items) {
  if (items.length === 0) {
    console.log('데이터가 없습니다.');
    return;
  }
  console.table(items);
}

async function handleCreate() {
  const name = await rl.question('name: ');
  const rest = {};
  console.log('추가 필드를 "key=value" 형식으로 입력하세요. 빈 줄을 입력하면 종료합니다.');
  while (true) {
    const line = await rl.question('field (key=value): ');
    if (!line.trim()) break;
    const [key, ...valueParts] = line.split('=');
    if (!key || valueParts.length === 0) {
      console.log('형식이 올바르지 않습니다. 예: phone=010-1234-5678');
      continue;
    }
    rest[key.trim()] = valueParts.join('=').trim();
  }
  const item = await createItem({ name, ...rest });
  console.log('생성되었습니다:', item);
}

async function handleReadAll() {
  const items = await readAll();
  printItems(items);
}

async function handleReadById() {
  const id = await rl.question('조회할 ID: ');
  const item = await readById(id);
  console.log(item ?? '해당 ID의 데이터가 없습니다.');
}

async function handleSearchByField() {
  const key = await rl.question('검색할 필드명: ');
  const value = await rl.question('검색할 값: ');
  const items = await searchByField(key, value);
  printItems(items);
}

async function handleUpdate() {
  const id = await rl.question('수정할 ID: ');
  const existing = await readById(id);
  if (!existing) {
    console.log('해당 ID의 데이터가 없습니다.');
    return;
  }
  console.log('현재 데이터:', existing);
  const key = await rl.question('수정할 필드명: ');
  const value = await rl.question('새 값: ');
  const updated = await updateItem(id, { [key]: value });
  console.log('수정되었습니다:', updated);
}

async function handleDelete() {
  const id = await rl.question('삭제할 ID: ');
  const existing = await readById(id);
  if (!existing) {
    console.log('해당 ID의 데이터가 없습니다.');
    return;
  }
  const confirm = await rl.question(`정말 삭제하시겠습니까? (ID: ${id}) [y/N]: `);
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('삭제를 취소했습니다.');
    return;
  }
  const deleted = await deleteItem(id);
  console.log(deleted ? '삭제되었습니다.' : '삭제에 실패했습니다.');
}

async function main() {
  let running = true;
  while (running) {
    printMenu();
    const choice = await rl.question('선택: ');
    switch (choice.trim()) {
      case '1':
        await handleCreate();
        break;
      case '2':
        await handleReadAll();
        break;
      case '3':
        await handleReadById();
        break;
      case '4':
        await handleSearchByField();
        break;
      case '5':
        await handleUpdate();
        break;
      case '6':
        await handleDelete();
        break;
      case '0':
        running = false;
        break;
      default:
        console.log('올바른 메뉴 번호를 선택하세요.');
    }
  }
  rl.close();
  console.log('프로그램을 종료합니다.');
}

main();
