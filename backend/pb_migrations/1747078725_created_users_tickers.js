/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "bzwgm0yumzyy4nw",
    "created": "2025-05-12 19:38:45.822Z",
    "updated": "2025-05-12 19:38:45.822Z",
    "name": "users_tickers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "f8trolir",
        "name": "user",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "uba9poyi",
        "name": "ticker",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bzwgm0yumzyy4nw");

  return dao.deleteCollection(collection);
})
