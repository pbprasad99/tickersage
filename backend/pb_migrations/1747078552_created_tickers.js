/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2bit83o3tkchnzh",
    "created": "2025-05-12 19:35:52.771Z",
    "updated": "2025-05-12 19:35:52.771Z",
    "name": "tickers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "owxpdlug",
        "name": "symbol",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "odpgiw4y",
        "name": "name",
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
  const collection = dao.findCollectionByNameOrId("2bit83o3tkchnzh");

  return dao.deleteCollection(collection);
})
