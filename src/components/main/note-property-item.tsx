"use client"
import {CalendarIcon, Clock, File, Hash, Link, LucideIcon, SquareChevronDown, SquareMousePointer, Text} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Property, PropertyType} from "@/lib/types";
import {useEffect, useRef, useState} from "react";
import {updateNotePropertyKey, updateNotePropertyValue} from "@/lib/properties";
import {useActiveNote} from "@/hooks/use-active-note";
import {MultiSelect} from "@/components/common/multi-select";
import { Calendar } from "@/components/ui/calendar"
import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {CustomSelect} from "@/components/common/costom-select";


function getPropertyIcons() {
  const icons = new Map<PropertyType, LucideIcon>();
  icons.set(PropertyType.NUMBER, Hash);
  icons.set(PropertyType.TEXT, Text);
  icons.set(PropertyType.SELECT, SquareMousePointer);
  icons.set(PropertyType.MULTI_SELECT, SquareChevronDown);
  icons.set(PropertyType.DATE, CalendarIcon);
  icons.set(PropertyType.DATETIME, Clock);
  icons.set(PropertyType.LINK, Link);
  icons.set(PropertyType.FILE, File);
  return icons
}


interface NotePropertyItemProps {
  noteId?: string,
  preview?: boolean,
  item: Property,
  keys: string[],
  isAdding?: boolean,
  setIsAdding?: (value: boolean) => void;
}


export const NotePropertyItem = ({noteId, item, preview, isAdding, keys, setIsAdding}: NotePropertyItemProps) => {
  const icons = getPropertyIcons()
  // const icons2 = getPropertyIcons2()
  const keyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [keyIsEditing, setKeyIsEditing] = useState(false);
  const [valueIsEditing, setValueIsEditing] = useState(false);
  const [key, setKey] = useState(item.key)
  const [value, setValue] = useState(item.value ?? "")

  const [Icon, setIcon] = useState<LucideIcon>(icons.get(item.type) ?? Text)

  const [selectedOption, setSelectedOption] = useState(item.value);
  const addProperty = useActiveNote((store) => store.addProperty)
  const [propertyType, setPropertyType] = useState(item.type)
  const [date, setDate] = React.useState<Date>()

  const propertyTypes = Object.values(PropertyType)

  const [selectedTags, setSelectedTags] = useState<string[]>(["frontend"])
  const [singleValue, setSingleValue] = useState<string[]>([])

  // Example with predefined options (Chinese terms like in the image)
  const options = [
    { value: "frontend", label: "前端" },
    { value: "backend", label: "后端" },
    { value: "fullstack", label: "全栈" },
    { value: "mobile", label: "移动端" },
  ]


  useEffect(() => {
    console.log("property")
    console.log(item)
    if (isAdding) {
      enableInput("key")
    }
  }, []);

  const enableInput = (which: string) => {
    if (which === "key") {
      setKeyIsEditing(true);
      setTimeout(() => {
        keyInputRef.current?.focus();
        keyInputRef.current?.setSelectionRange(0, 0)
      }, 20);
    } else {
      setValueIsEditing(true);
      setTimeout(() => {
        valueInputRef.current?.focus();
        valueInputRef.current?.setSelectionRange(0, 0)
      }, 20);
    }
  };

  const disableInput = (which: string) => {
    if (which === "key") {
      setKeyIsEditing(false);
      if (typeof noteId !== "undefined" && key !== "" && !keys.includes(key)) {
        console.log(`更新属性Key为: ${key}`)
        item.key = key
        void updateNotePropertyKey(noteId, item.id, key).then((propertyId) => {
          if (propertyId !== "") {
            item.id = propertyId
          }
        })
      }
    } else {
      setValueIsEditing(false)
      if (typeof noteId !== "undefined") {
        console.log(`更新属性值为: ${value}`)
        void updateNotePropertyValue(noteId, item.id, value)
        item.value = value
      }
    }
    if (isAdding && typeof setIsAdding !== "undefined") {
      if (key !== "" && !keys.includes(key)) {
        addProperty(item)
      }
      setTimeout(() => {
        enableInput("value")
      }, 0);
      setIsAdding(false)

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
    } else {
      setValue(event.target.value)
    }
  };

  const onSelectOption = (value: string) => {
    console.log(`更新属性值为: ${value}`)
    setSelectedOption((value))
    if (typeof noteId !== "undefined") {
      void updateNotePropertyValue(noteId, item.id, value)
    }
  }

  const onChangePropertyType = (value: string) => {
    const newPropertyType:PropertyType = value as PropertyType
    setPropertyType(newPropertyType)

    if (typeof newPropertyType === "undefined") return
    const newIcon = icons.get(newPropertyType)
    if (typeof newIcon === "undefined") return;

    setIcon(newIcon)
    item.type = newPropertyType
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 text-gray-500 w-40">
        <div className="flex w-6 h-6 rounded-xs hover:bg-accent dark:hover:bg-neutral-600 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Icon className="w-5 h-5"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-22">
              {/*<DropdownMenuLabel>Property Type</DropdownMenuLabel>*/}
              {/*<DropdownMenuSeparator/>*/}
              <DropdownMenuRadioGroup value={propertyType} onValueChange={onChangePropertyType}>
                {propertyTypes.map((item, index) => (
                  <DropdownMenuRadioItem key={index} value={item}>{item}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                   className="h-7 w-32 text-gray-800 focus-visible:ring-transparent rounded-sm px-1"/>
          ) : (
            <div onClick={() => {
              enableInput("key")
            }}
                 className="h-7 font-normal hover:bg-accent text-sm py-1 px-1 rounded-sm w-32">
              <span className="truncate text-gray-800">{key}</span>
            </div>)}
        </span>
      </div>

      {(item.type === PropertyType.TEXT || item.type === PropertyType.DATETIME ) && (
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
                   className="h-7 focus-visible:ring-transparent rounded-sm px-1"/>
          ) : (
            <div onClick={() => {
              enableInput("value")
            }}
                 className="h-7 w-full font-normal hover:bg-accent text-sm py-1 px-1 rounded-sm">
              <span className="truncate">{value !== "" ? value : "-"}</span>
            </div>)}
        </>
      )}

      {item.type === PropertyType.FILE && (
        <>
          {!preview ? (
            <Input type="file"
                   onChange={(e) => {}}
                   value={value}
                   className="focus-visible:ring-transparent rounded-sm"/>
          ) : (
            <div onClick={() => {
              enableInput("value")
            }}
                 className="h-7 w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value !== "" ? value : "-"}</span>
            </div>)}
        </>

      )}

      {item.type === PropertyType.LINK && (
        <>
          {valueIsEditing && !preview ? (
            <Input ref={valueInputRef} type="url"
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
                 className="h-7 w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value !== "" ? value : "-"}</span>
            </div>)}
        </>

      )}

      {item.type === PropertyType.NUMBER && (
        <>
          {valueIsEditing && !preview ? (
            <Input ref={valueInputRef} type="number"
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
            }} className="h-7 w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value !== "" ? value : "-"}</span>
            </div>)}
        </>

      )}

      {item.type === PropertyType.DATE && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal rounded-sm",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}

      {item.type === PropertyType.MULTI_SELECT && (
        <CustomSelect
          options={options}
          value={selectedTags}
          onChange={setSelectedTags}
          placeholder="Select an option or create one"
          allowMultiple={true}
        />
      )}

      {(item.type === PropertyType.SELECT ) && (
        <>
          {!preview ? (
            <CustomSelect
              options={options}
              value={singleValue}
              onChange={setSingleValue}
              placeholder="Choose one option"
              allowMultiple={false}
            />
            // <Select value={selectedOption} onValueChange={onSelectOption}>
            //   <SelectTrigger className="h-7 border-0 shadow-none hover:bg-accent w-full">
            //     <SelectValue/>
            //   </SelectTrigger>
            //   <SelectContent>
            //     {item.options?.map((option, index) => (
            //       <SelectItem key={index} value={option.text}>
            //         <div
            //           className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200")}>
            //           {option.text}
            //         </div>
            //       </SelectItem>
            //     ))}
            //   </SelectContent>
            // </Select>
          ) : (
            <div onClick={() => {
              enableInput("value")
            }}
                 className="h-9 w-full font-normal hover:bg-accent text-sm py-1 px-3.5 rounded-sm">
              <span className="truncate">{value}</span>
            </div>)}
        </>
      )}
    </div>
  )
}
