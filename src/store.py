import json
import os

DEFAULT_DB_PATH = os.path.join(os.getcwd(), "data", "db.json")


def _ensure_db_file(db_path):
    dir_path = os.path.dirname(db_path)
    if dir_path and not os.path.isdir(dir_path):
        os.makedirs(dir_path, exist_ok=True)
    if not os.path.isfile(db_path):
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump({"items": [], "nextId": 1}, f, indent=2, ensure_ascii=False)


def _load_db(db_path=DEFAULT_DB_PATH):
    _ensure_db_file(db_path)
    with open(db_path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_db(db, db_path=DEFAULT_DB_PATH):
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)


def create_item(fields, db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    item = {"id": db["nextId"], **fields}
    db["items"].append(item)
    db["nextId"] += 1
    _save_db(db, db_path)
    return item


def read_all(db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    return db["items"]


def read_by_id(item_id, db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return None
    for item in db["items"]:
        if item["id"] == item_id:
            return item
    return None


def search_by_field(key, value, db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    return [item for item in db["items"] if str(item.get(key)) == str(value)]


def update_item(item_id, updates, db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return None
    for index, item in enumerate(db["items"]):
        if item["id"] == item_id:
            updated = {**item, **updates, "id": item["id"]}
            db["items"][index] = updated
            _save_db(db, db_path)
            return updated
    return None


def delete_item(item_id, db_path=DEFAULT_DB_PATH):
    db = _load_db(db_path)
    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return False
    for index, item in enumerate(db["items"]):
        if item["id"] == item_id:
            del db["items"][index]
            _save_db(db, db_path)
            return True
    return False
