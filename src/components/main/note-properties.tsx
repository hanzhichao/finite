"use client"
import {
  Calendar,
  CircleChevronDown,
  Clock,
  File,
  Link,
  LucideIcon,
  Plus,
  SquareChevronDown,
  Tag,
  Text
} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Property, PropertyType} from "@/lib/types";
import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";
import {addNoteProperty, updateNotePropertyKey, updateNotePropertyValue} from "@/lib/properties";
import {useActiveNote} from "@/hooks/use-active-note";
import {Separator} from "@/components/ui/separator";


interface PropertyItemProps {
  noteId?: string,
  preview?: boolean,
  item: Property
}

function getPropertyIcons() {
  const icons = new Map<PropertyType, LucideIcon>();
  icons.set(PropertyType.NUMBER, Text); // todo
  icons.set(PropertyType.TEXT, Text);
  icons.set(PropertyType.SELECT, CircleChevronDown);
  icons.set(PropertyType.MULTI_SELECT, SquareChevronDown);
  icons.set(PropertyType.DATE, Calendar);
  icons.set(PropertyType.DATATIME, Clock);
  icons.set(PropertyType.TAG, Tag);
  icons.set(PropertyType.LINK, Link);
  icons.set(PropertyType.FILE, File);
  return icons
}

const PropertyItem = ({noteId, item, preview}: PropertyItemProps) => {
  const icons = getPropertyIcons()
  const keyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [keyIsEditing, setKeyIsEditing] = useState(false);
  const [valueIsEditing, setValueIsEditing] = useState(false);
  const [key, setKey] = useState(item.key)
  const [value, setValue] = useState(item.value ?? "")
  const Icon: LucideIcon = icons.get(item.type) ?? Text
  const [selectedOption, setSelectedOption] = useState(item.value);

  useEffect(() => {
    console.log("property")
    console.log(item)
  }, []);

  const enableInput = (which: string) => {
    if (which === "key") {
      setKeyIsEditing(true);
      setTimeout(() => {
        keyInputRef.current?.focus();
        // inputRef.current?.setSelectionRange(0, 0)
      }, 0);
    } else {
      setValueIsEditing(true);
      setTimeout(() => {
        valueInputRef.current?.focus();
        // inputRef.current?.setSelectionRange(0, 0)
      }, 0);
    }
  };

  const disableInput = (which: string) => {
    if (which === "key") {
      setKeyIsEditing(false);
    } else {
      setValueIsEditing(false)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, which: string) => {
    if (event.key === "Enter") {
      disableInput(which);
    }
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>, which: string) => {
    if (which === "key") {
      setKey(event.target.value)
      if (typeof noteId !== "undefined") {
        console.log(`更新属性Key为: ${event.target.value}`)
        void updateNotePropertyKey(item.id, event.target.value || "")
      }
    } else {
      setValue(event.target.value)
      if (typeof noteId !== "undefined") {
        console.log(`更新属性值为: ${event.target.value}`)
        void updateNotePropertyValue(noteId, item.id, event.target.value || "")
      }
    }
  };

  const onSelectOption = (value: string) => {
    console.log(`更新属性值为: ${value}`)
    setSelectedOption((value))
    if (typeof noteId !== "undefined") {
      void updateNotePropertyValue(noteId, item.id, value)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-gray-500 w-38">
        <Icon className="w-4 h-4"/>
        {/*<span className="text-sm">{item.key}</span>*/}
        <span>
          {keyIsEditing && !preview ? (
            <Input ref={keyInputRef}
                   onClick={() => {
                     enableInput("key")
                   }}
                   onBlur={() => {
                     disableInput("key")
                   }}
                   onKeyDown={(e) => {
                     onKeyDown(e, "key")
                   }}
                   onChange={(e) => {
                     onChangeInput(e, "key")
                   }}
                   value={key}
                   className="h-7 w-32 text-gray-800 focus-visible:ring-transparent rounded-sm"/>
          ) : (
            <div onClick={() => {
              enableInput("key")
            }}
                 className="font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm w-32">
              <span className="truncate text-gray-800">{key}</span>
            </div>)}
        </span>
      </div>

      {(item.type === PropertyType.TEXT || item.type === PropertyType.DATATIME || item.type === PropertyType.NUMBER) && (
        <>
          {valueIsEditing && !preview ? (
            <Input ref={valueInputRef}
                   onClick={() => {
                     enableInput("value")
                   }}
                   onBlur={() => {
                     disableInput("value")
                   }}
                   onKeyDown={(e) => {
                     onKeyDown(e, "value")
                   }}
                   onChange={(e) => {
                     onChangeInput(e, "value")
                   }}
                   value={value}
                   className="h-7 focus-visible:ring-transparent rounded-sm"/>
          ) : (
            <div onClick={() => {
              enableInput("value")
            }}
                 className="w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value}</span>
            </div>)}
        </>
      )}

      {(item.type === PropertyType.SELECT || item.type === PropertyType.MULTI_SELECT || item.type === PropertyType.TAG || item.type === PropertyType.STATUS) && (
        <>
          {!preview ? (
            <Select value={selectedOption} onValueChange={onSelectOption}>
              <SelectTrigger className="h-7 border-0 shadow-none hover:bg-accent w-full">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                {item.options?.map((option, index) => (
                  <SelectItem key={index} value={option.text}>
                    <div
                      className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200")}>
                      {option.text}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div onClick={() => {enableInput("value")}}
                 className="h-9 w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value}</span>
            </div>)}
        </>
      )}

    </div>
  )
}

export default function NoteProperties() {
  const activeNoteId = useActiveNote((store) => store.activeNoteId)
  const preview = useActiveNote((store) => store.isLocked) === 1
  const properties = useActiveNote((store) => store.properties)
  const propertyTypes = ["Number", "Text", "Select", "Muti-Select", "Date", "DateTime", "Tag", "Status", "File"]
  const addProperty = useActiveNote((store) => store.addProperty)


  const onAddProperty = () => {
    if (typeof activeNoteId !== "undefined") {
      const newProperty: Property = {id: "", note_id: activeNoteId, key: "key", type: PropertyType.TEXT, value: "value"}
      void addNoteProperty(activeNoteId, newProperty.key, newProperty.type, newProperty.value ?? "value")
      addProperty(newProperty)
    }
  }

  return (
    <div className="px-[54px] py-2 my-2">
      {/*<Separator className="mb-4"/>*/}
      <div className="space-y-2">
        {properties.map((item, index) => (
          <div key={index}>
            <PropertyItem noteId={activeNoteId} item={item} preview={preview}/>
          </div>
        ))}
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
