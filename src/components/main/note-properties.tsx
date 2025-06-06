"use client"
import {
  Plus,
} from "lucide-react"
import {Property, PropertyType} from "@/lib/types";
import {useEffect, useState} from "react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Separator} from "@/components/ui/separator";
import {NotePropertyItem} from "@/components/main/note-property-item";
import {removeNoteProperty} from "@/lib/properties";
import { useTranslation } from "react-i18next";
const generateNewProperty = (noteId: string) => {
  const newProperty: Property = {id: "", note_id: noteId, key: "", type: PropertyType.TEXT, value: ""}
  return newProperty
}

export default function NoteProperties() {
  const activeNoteId = useActiveNote((store) => store.activeNoteId)
  const preview = useActiveNote((store) => store.isLocked) === 1
  const properties = useActiveNote((store) => store.properties)
  const updateProperties = useActiveNote((store) => store.updateProperties)
  const { t } = useTranslation();

  // 添加新属性
  const [isAdding, setIsAdding] = useState(false)

  const keys = properties.map(property => property.key);

  const onAddProperty = () => {
    setIsAdding(true)
  }
  useEffect(() => {
    console.log("加载 NoteProperties")
    console.log(properties)
  }, [activeNoteId, properties]);

  const onRemoveProperty = (propertyId: string) => {
    if(typeof activeNoteId !== "undefined"){
      void removeNoteProperty(activeNoteId, propertyId)
      const newProperties = properties.filter(item => item.id !== propertyId);
      console.log(`remove property_id: ${propertyId}`)
      console.log(newProperties)
      updateProperties(newProperties)
    }

  }
  return (
    <div className="pl-1 py-2 my-2 pr-[54px]">
      {/*<Separator className="mb-4"/>*/}
      <div className="space-y-2">
        {properties.map((item) => (
          <div key={item.id}>
            <NotePropertyItem noteId={activeNoteId} item={item} preview={preview} keys={keys} onRemoveProperty={onRemoveProperty}/>
          </div>
        ))}
        {isAdding && (
          <div key="">
            <NotePropertyItem noteId={activeNoteId} item={generateNewProperty(activeNoteId ?? "")} preview={preview}
                          isAdding={isAdding} keys={keys} setIsAdding={setIsAdding}/>
          </div>
        )}

      </div>

      {/* Add Property Button */}
      <div className="pl-[54px]">
        {!preview && (
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-4 text-sm" onClick={() => {
            onAddProperty();
          }}>
            <Plus className="w-4 h-4"/>
            <span>{t("Add a property")}</span>
          </button>
        )}
        <Separator className="mt-4"/>
      </div>

    </div>
  )
}
