/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2bit83o3tkchnzh")

  // remove
  collection.schema.removeField("owxpdlug")

  // remove
  collection.schema.removeField("odpgiw4y")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ksaxyagb",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "edsmdcfl",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2bit83o3tkchnzh")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("ksaxyagb")

  // remove
  collection.schema.removeField("edsmdcfl")

  return dao.saveCollection(collection)
})
