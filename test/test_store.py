import os
import sys
import tempfile
import shutil
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from store import (
    create_item,
    read_all,
    read_by_id,
    search_by_field,
    update_item,
    delete_item,
)


class StoreTest(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp(prefix="json-crud-test-")
        self.db_path = os.path.join(self.tmp_dir, "db.json")

    def tearDown(self):
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_create_item_assigns_auto_increment_id(self):
        first = create_item({"name": "홍길동"}, self.db_path)
        second = create_item({"name": "김철수"}, self.db_path)
        self.assertEqual(first["id"], 1)
        self.assertEqual(second["id"], 2)

    def test_read_all_returns_all_items(self):
        create_item({"name": "A"}, self.db_path)
        create_item({"name": "B"}, self.db_path)
        items = read_all(self.db_path)
        self.assertEqual(len(items), 2)

    def test_read_by_id_finds_item_or_none(self):
        created = create_item({"name": "A"}, self.db_path)
        found = read_by_id(created["id"], self.db_path)
        self.assertEqual(found, created)

        not_found = read_by_id(999, self.db_path)
        self.assertIsNone(not_found)

    def test_search_by_field_filters_by_value(self):
        create_item({"name": "A", "team": "dev"}, self.db_path)
        create_item({"name": "B", "team": "qa"}, self.db_path)
        create_item({"name": "C", "team": "dev"}, self.db_path)

        devs = search_by_field("team", "dev", self.db_path)
        self.assertEqual(len(devs), 2)
        self.assertTrue(all(item["team"] == "dev" for item in devs))

    def test_update_item_updates_only_given_fields(self):
        created = create_item({"name": "A", "team": "dev"}, self.db_path)
        updated = update_item(created["id"], {"team": "qa"}, self.db_path)
        self.assertEqual(updated["id"], created["id"])
        self.assertEqual(updated["name"], "A")
        self.assertEqual(updated["team"], "qa")

    def test_update_item_returns_none_for_missing_id(self):
        result = update_item(999, {"name": "X"}, self.db_path)
        self.assertIsNone(result)

    def test_delete_item_removes_item_and_returns_true(self):
        created = create_item({"name": "A"}, self.db_path)
        result = delete_item(created["id"], self.db_path)
        self.assertTrue(result)

        remaining = read_all(self.db_path)
        self.assertEqual(len(remaining), 0)

    def test_delete_item_returns_false_for_missing_id(self):
        result = delete_item(999, self.db_path)
        self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()
