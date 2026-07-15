from store import (
    create_item,
    read_all,
    read_by_id,
    search_by_field,
    update_item,
    delete_item,
)


def print_menu():
    print(
        """
===== JSON CRUD 콘솔 애플리케이션 =====
1. Create - 데이터 추가
2. Read   - 전체 목록 보기
3. Read   - ID로 검색
4. Read   - 필드 값으로 검색
5. Update - 데이터 수정
6. Delete - 데이터 삭제
0. 종료
========================================"""
    )


def print_items(items):
    if not items:
        print("데이터가 없습니다.")
        return
    for item in items:
        print(item)


def handle_create():
    name = input("name: ")
    rest = {}
    print('추가 필드를 "key=value" 형식으로 입력하세요. 빈 줄을 입력하면 종료합니다.')
    while True:
        line = input("field (key=value): ")
        if not line.strip():
            break
        if "=" not in line:
            print("형식이 올바르지 않습니다. 예: phone=010-1234-5678")
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if not key:
            print("형식이 올바르지 않습니다. 예: phone=010-1234-5678")
            continue
        rest[key] = value.strip()
    item = create_item({"name": name, **rest})
    print("생성되었습니다:", item)


def handle_read_all():
    items = read_all()
    print_items(items)


def handle_read_by_id():
    item_id = input("조회할 ID: ")
    item = read_by_id(item_id)
    print(item if item is not None else "해당 ID의 데이터가 없습니다.")


def handle_search_by_field():
    key = input("검색할 필드명: ")
    value = input("검색할 값: ")
    items = search_by_field(key, value)
    print_items(items)


def handle_update():
    item_id = input("수정할 ID: ")
    existing = read_by_id(item_id)
    if existing is None:
        print("해당 ID의 데이터가 없습니다.")
        return
    print("현재 데이터:", existing)
    key = input("수정할 필드명: ")
    value = input("새 값: ")
    updated = update_item(item_id, {key: value})
    print("수정되었습니다:", updated)


def handle_delete():
    item_id = input("삭제할 ID: ")
    existing = read_by_id(item_id)
    if existing is None:
        print("해당 ID의 데이터가 없습니다.")
        return
    confirm = input(f"정말 삭제하시겠습니까? (ID: {item_id}) [y/N]: ")
    if confirm.strip().lower() != "y":
        print("삭제를 취소했습니다.")
        return
    deleted = delete_item(item_id)
    print("삭제되었습니다." if deleted else "삭제에 실패했습니다.")


def main():
    handlers = {
        "1": handle_create,
        "2": handle_read_all,
        "3": handle_read_by_id,
        "4": handle_search_by_field,
        "5": handle_update,
        "6": handle_delete,
    }
    running = True
    while running:
        print_menu()
        choice = input("선택: ").strip()
        if choice == "0":
            running = False
        elif choice in handlers:
            handlers[choice]()
        else:
            print("올바른 메뉴 번호를 선택하세요.")
    print("프로그램을 종료합니다.")


if __name__ == "__main__":
    main()
