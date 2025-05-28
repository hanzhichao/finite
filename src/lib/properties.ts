import {connDb} from "./notes";
import {Option, Property, PropertyType} from "./types"
import {generateUUID} from "./utils";

export async function getProperties(noteId: string) {
  const db = await connDb();
  console.log(`db查询Property列表: note_id=${noteId}`);
  const result = await db.select<Property[]>(`
      SELECT id, key, type, value
      FROM properties
      LEFT JOIN notes_properties ON properties.id = notes_properties.property_id
      WHERE note_id = $1;`, [noteId]);

  const properties: Property[] = [];
  for (const property of result){
    property.options = await db.select<Option[]>(`SELECT * FROM options where property_id=$1`, [property.id])
    properties.push(property)
  }
  return properties;
}

export async function addNoteProperty(noteId: string, property_key: string, type: PropertyType, value: string) {
  console.log(`db添加笔记属性: noteId=${noteId}, property=${property_key}, type=${type}`);
  const db = await connDb();
  let propertyId: string;

  const result = await db.select<Property[]>(`SELECT id,key,type FROM properties where key=$1`, [property_key])
  if (result.length ===0 ){
    propertyId = generateUUID();
    console.log(`db新建属性: ${property_key}`)
    await db.execute("INSERT INTO properties (id, key,type) VALUES ($1,$2,$3)", [propertyId, property_key, type]);
  }
  propertyId = result[0].id
  await db.execute("INSERT INTO notes_properties (property_id,note_id,value) VALUES ($1,$2,$3)", [propertyId, noteId, value]);
}

export async function updateNotePropertyValue(noteId: string, propertyId: string, value: string) {
  console.log(`db更新Note属性值: noteId=${noteId}, propertyId=${propertyId}, value=${value}`);
  const db = await connDb();
  await db.execute("UPDATE notes_properties SET value = CAST($1 AS VARCHAR) WHERE note_id = $2 AND property_id = $3", [value, noteId, propertyId]);
}

export async function updateNotePropertyKey(propertyId: string, key: string) {
  console.log(`db更新Note属性值: propertyId=${propertyId}, key=${key}`);
  const db = await connDb();
  await db.execute("UPDATE properties SET key = $1 WHERE id = $2", [key, propertyId]);
}