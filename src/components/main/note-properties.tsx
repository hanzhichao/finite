"use client"
import {
  Plus,
} from "lucide-react"
import {Property, PropertyType} from "@/lib/types";
import {useState} from "react";
import {useActiveNote} from "@/hooks/use-active-note";
import {Separator} from "@/components/ui/separator";
import {NotePropertyItem} from "@/components/main/note-property-item";

const generateNewProperty = (noteId: string) => {
  const newProperty: Property = {id: "", note_id: noteId, key: "", type: PropertyType.TEXT, value: ""}
  return newProperty
}

export default function NoteProperties() {
  const activeNoteId = useActiveNote((store) => store.activeNoteId)
  const preview = useActiveNote((store) => store.isLocked) === 1
  const properties = useActiveNote((store) => store.properties)

  // 添加新属性
  const [isAdding, setIsAdding] = useState(false)


  const keys = properties.map(property => property.key);

  const onAddProperty = () => {
    setIsAdding(true)
  }

  return (
    <div className="px-[54px] py-2 my-2">
      {/*<Separator className="mb-4"/>*/}
      <div className="space-y-2">
        {properties.map((item, index) => (
          <div key={index}>
            <NotePropertyItem noteId={activeNoteId} item={item} preview={preview} keys={keys}/>
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
      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-4 text-sm" onClick={() => {
        onAddProperty();
      }}>
        <Plus className="w-4 h-4"/>
        <span>Add a property</span>
      </button>
      <Separator className="mt-4"/>
    </div>
  )
}
