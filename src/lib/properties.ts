import {connDb} from "./notes";
import {Option, Property, PropertyType} from "./types"
import {generateUUID} from "./utils";

export async function getOptions(propertyId: string){
  console.log(`db查询Options: property_id=${propertyId}`)
  const db = await connDb();
  return await db.select<Option[]>(`SELECT label,value,bg_color FROM options WHERE property_id=$1`, [propertyId])
}

export async function addOption(propertyId: string, label: string, value?: string, bg_color?: string){
  value = typeof value != "undefined" ? value : label
  bg_color = typeof bg_color != "undefined" ? bg_color : ""
  const db = await connDb();
  return await db.select<Option[]>(`INSERT INTO options (property_id, label, value, bg_color) VALUES ($1,$2,$3,$4)`, [propertyId, label,value, bg_color])
}


export async function getProperties(noteId: string) {
  const db = await connDb();
  console.log(`db查询Property列表: note_id=${noteId}`);
  const result = await db.select<Property[]>(`
      SELECT id, key, type, value
      FROM properties
      LEFT JOIN notes_properties ON properties.id = notes_properties.property_id
      WHERE note_id = $1;`, [noteId]);

  console.log("properties")
  console.log(result)

  const properties: Property[] = [];
  for (const property of result){
    const result = await getOptions(property.id)
    console.log("options")
    console.log(result)
    if(result.length > 0){
      property.options = result
    }
    properties.push(property)
  }
  return properties;
}


export async function addNoteProperty(noteId: string, property_key: string, type: PropertyType, value: string) {
  console.log(`db添加笔记属性: noteId=${noteId}, property=${property_key}, type=${type}`);
  const db = await connDb();
  let propertyId: string;

  if (property_key === "") return ""
  // 查询同名 key 是否存在
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

export async function updatePropertyKey(noteId: string, propertyId: string, key: string) {
  if (typeof key==="undefined" || key === "") return ""

  if (propertyId === ""){
    return  await addNoteProperty(noteId, key, PropertyType.TEXT, "")
  }

  const db = await connDb();
  console.log(`db更新Note属性Key: propertyId=${propertyId}, key=${key}`);
  await db.execute("UPDATE properties SET key = $1 WHERE id = $2", [key, propertyId]);
  return propertyId
}

export async function updatePropertyType(noteId: string, propertyId: string, type: PropertyType) {
  console.log(`db更新Note属性类型: noteId=${noteId}, propertyId=${propertyId}, type=${type}`);
  const db = await connDb();
  await db.execute("UPDATE properties SET type = $1 WHERE id = $2", [type as string, propertyId]);
}

export async function removeNoteProperty(noteId: string, propertyId: string) {
  console.log(`db删除Note属性: noteId=${noteId}, propertyId=${propertyId}}`);
  const db = await connDb();
  await db.execute("DELETE FROM notes_properties WHERE note_id = $1 AND property_id = $2", [noteId, propertyId]);
}
