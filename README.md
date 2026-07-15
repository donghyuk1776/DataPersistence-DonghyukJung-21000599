# JSON CRUD 콘솔 애플리케이션 (PoC)

JSON 파일을 데이터 저장소로 사용하는 Create / Read / Update / Delete 콘솔 애플리케이션입니다.

## 기능

- **Create**: 새로운 데이터를 입력 받아 JSON 파일에 저장
- **Read**: 전체 목록 조회 및 ID / 필드 값으로 검색
- **Update**: 기존 데이터를 선택하여 특정 필드 수정
- **Delete**: 확인 절차를 거쳐 특정 데이터를 안전하게 삭제

## 요구 사항

- Node.js 18 이상 (ESM, `node:test`, `fs/promises` 사용)

## 실행 방법

```bash
npm start
```

실행하면 콘솔 메뉴가 표시되며, 번호를 입력해 각 기능을 사용할 수 있습니다.

```
===== JSON CRUD 콘솔 애플리케이션 =====
1. Create - 데이터 추가
2. Read   - 전체 목록 보기
3. Read   - ID로 검색
4. Read   - 필드 값으로 검색
5. Update - 데이터 수정
6. Delete - 데이터 삭제
0. 종료
========================================
```

- Create 시 `name`을 먼저 입력한 뒤, `key=value` 형식으로 추가 필드를 원하는 만큼 입력할 수 있습니다. 빈 줄을 입력하면 필드 입력이 종료됩니다.
- Update 시 수정할 필드명과 새 값을 입력하면 해당 필드만 변경됩니다.
- Delete 시 삭제 여부를 한 번 더 확인합니다.

## 데이터 저장 위치

데이터는 `data/db.json` 파일에 저장됩니다. 파일이 없으면 최초 실행 시 자동으로 생성됩니다.

```json
{
  "items": [],
  "nextId": 1
}
```

## 프로젝트 구조

```
.
├── src/
│   ├── store.js   # JSON 파일 기반 CRUD 로직 (I/O와 분리되어 테스트 가능)
│   └── cli.js     # 콘솔 메뉴 및 사용자 입출력 처리
├── test/
│   └── store.test.js
├── data/
│   └── db.json    # 실행 시 자동 생성되는 데이터 파일
└── package.json
```

## 테스트

```bash
npm test
```

`node:test`와 `node:assert/strict`를 사용하며, 매 테스트마다 임시 디렉터리에 별도의 DB 파일을 생성하여 실제 데이터(`data/db.json`)에 영향을 주지 않습니다.
