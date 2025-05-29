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

  if (property_key === "") return ""

  const result = await db.select<Property[]>(`SELECT id,key,type FROM properties where key=$1`, [property_key])
  console.log(result)
  if (result.length === 0 ){
    propertyId = generateUUID();
    console.log(`db新建属性: ${property_key}`)
    await db.execute("INSERT INTO properties (id, key,type) VALUES ($1,$2,$3)", [propertyId, property_key, type]);
  } else {
    propertyId = result[0].id
  }
  await db.execute("INSERT INTO notes_properties (property_id,note_id,value) VALUES ($1,$2,$3)", [propertyId, noteId, value]);
  return propertyId
}

export async function updateNotePropertyValue(noteId: string, propertyId: string, value: string) {
  console.log(`db更新Note属性值: noteId=${noteId}, propertyId=${propertyId}, value=${value}`);
  const db = await connDb();
  await db.execute("UPDATE notes_properties SET value = CAST($1 AS VARCHAR) WHERE note_id = $2 AND property_id = $3", [value, noteId, propertyId]);
}

export async function updateNotePropertyKey(noteId: string, propertyId: string, key: string) {
  if (typeof key==="undefined" || key === "") return ""

  if (propertyId === ""){
    return  await addNoteProperty(noteId, key, PropertyType.TEXT, "")
  }

  const db = await connDb();

  // const result = await db.select<Property[]>(`SELECT id,key,type FROM properties where id=$1`, [propertyId])
  // if (result.length ===0 ){
  //   propertyId = generateUUID();
  //   console.log(`db新建属性: ${key}`)
  //   await db.execute("INSERT INTO properties (id, key,type) VALUES ($1,$2,$3)", [propertyId, key, PropertyType.TEXT]);
  // }
  // propertyId = result[0].id

  console.log(`db更新Note属性值: propertyId=${propertyId}, key=${key}`);
  await db.execute("UPDATE properties SET key = $1 WHERE id = $2", [key, propertyId]);
  return propertyId

  // const result2 = await db.select<string[]>(`SELECT property_id FROM notes_properties where note_id=$1 AND property_id=$2`, [noteId, propertyId])
  // if (result2.length ===0 ){
  //   propertyId = generateUUID();
  //   console.log(`db新建属性: ${key}`)
  //   await db.execute("INSERT INTO notes_properties (note_id, property_id,value) VALUES ($1,$2,$3)", [noteId, propertyId, "Empty"]);
  // }
}