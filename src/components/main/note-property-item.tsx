"use client"

import {
  CalendarIcon,
  Clock,
  File, GripVertical,
  Hash,
  Link,
  LucideIcon, Minus,
  SquareChevronDown,
  SquareMousePointer,
  Text, X
} from "lucide-react"
import {Option, Property, PropertyType} from "@/lib/types";
import {useEffect, useState} from "react";
import {
  addOption,
  updatePropertyKey,
  updateNotePropertyValue,
  updatePropertyType,
} from "@/lib/properties";
import {useActiveNote} from "@/hooks/use-active-note";
import {Calendar} from "@/components/ui/calendar"
import * as React from "react"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ClickInput} from "@/components/common/click-input";
import {AddableSelect} from "@/components/common/addable-select";
import {DateTimePicker} from "@/components/common/date-time-picker";
import {Badge} from "@/components/ui/badge";


function getPropertyIcons() {
  const icons = new Map<PropertyType, LucideIcon>();
  icons.set(PropertyType.NUMBER, Hash);
  icons.set(PropertyType.TEXT, Text);
  icons.set(PropertyType.SELECT, SquareMousePointer);
  icons.set(PropertyType.MULTI_SELECT, SquareChevronDown);
  icons.set(PropertyType.DATE, CalendarIcon);
  icons.set(PropertyType.DATETIME, Clock);
  icons.set(PropertyType.LINK, Link);
  // icons.set(PropertyType.FILE, File);
  return icons
}

interface NotePropertyItemProps {
  noteId?: string,
  preview?: boolean,
  item: Property,
  keys: string[],
  isAdding?: boolean,
  setIsAdding?: (value: boolean) => void;
  onRemoveProperty?: (propertyId: string) => void;
}


export const NotePropertyItem = ({
                                   noteId, item, preview, isAdding, keys, setIsAdding,
                                   onRemoveProperty
                                 }: NotePropertyItemProps) => {
  const icons = getPropertyIcons()
  const addProperty = useActiveNote((store) => store.addProperty)
  const [propertyType, setPropertyType] = useState<PropertyType>(item.type as PropertyType)
  const [Icon, setIcon] = useState<LucideIcon>(icons.get(propertyType) ?? Text)
  const [date, setDate] = React.useState<Date>()
  const propertyTypes = Object.values(PropertyType)
  const [optionValue, setOptionValue] = useState<string[]>(item.value ? item.value.split(",") : [])
  const [options, setOptions] = useState(item.options ?? [])

  useEffect(() => {
    if (propertyType === PropertyType.DATE || propertyType === PropertyType.DATETIME) {
      if (typeof item.value !== "undefined" && item.value !== "") {
        const valueToDate = new Date(item.value)
        setDate(valueToDate)
      }
    }
  }, []);

  const onChangeKey = (key: string) => {
    if (typeof noteId !== "undefined" && key !== "" && !keys.includes(key)) {
      console.log(`更新属性Key为: ${key}`)
      item.key = key
      void updatePropertyKey(noteId, item.id, key).then((propertyId) => {
        if (propertyId !== "") {
          item.id = propertyId
        }
      })
      if (isAdding) addProperty(item)
    }
    setIsAdding?.(false)
  }

  const onChangeValue = (value: string) => {
    if (typeof noteId !== "undefined") {
      console.log(`更新属性值为: ${value}`)
      void updateNotePropertyValue(noteId, item.id, value)
      item.value = value
    }
  }

  const onChangeSelect = (labels: string[]) => {
    console.log("onSelectChange")
    setOptionValue(labels)
    if (labels.length === 0) return

    const optionLabels = options.map(item => item.label)

    for (const label of labels) {
      if (!optionLabels.includes(label)) {
        // const newOption: Option = {label: label, value: label.toLowerCase(), bg_color: ""}
        console.log(`warn: not include: ${label}`)
      }
      if (typeof noteId !== "undefined") {
        void updateNotePropertyValue(noteId, item.id, labels.join(","))
      }
    }
  }

  const onAddOption = (option: Option) => {
    void addOption(item.id, option.label, option.value, option.bg_color)
    setOptions([...options, option])
  }

  const onChangePropertyType = (value: string) => {
    const newPropertyType: PropertyType = value as PropertyType

    if (typeof noteId !== "undefined") {
      void updatePropertyType(noteId, item.id, newPropertyType)
    }
    setPropertyType(newPropertyType)

    if (typeof newPropertyType === "undefined") return
    const newIcon = icons.get(newPropertyType)
    if (typeof newIcon === "undefined") return;
    setIcon(newIcon)
    item.type = newPropertyType
  }

  const onChangeDate = (date: Date | undefined) => {
    console.log(`更新时间日期为: ${date?.toISOString()}`)
    if (typeof noteId != "undefined" && typeof date != "undefined") {
      void updateNotePropertyValue(noteId, item.id, date.toISOString())
    }
    item.value = date?.toISOString()
    setDate(date)
  }

  return (
    <div className="flex items-center gap-1">
      <div className={cn("flex items-center gap-1 text-gray-500 w-42", preview && "pl-[52px]")}>
        {!preview && (
          <div className="group flex items-center gap-0">
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm" onClick={() => {
              onRemoveProperty?.(item.id)
            }}>
              <Minus className="font-bold h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100"/>
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm">
              <GripVertical className="font-bold h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100"/>
            </Button>
          </div>
        )}

        {/*属性类型图标*/}
        <div className="flex w-6 h-6 rounded-sm hover:bg-accent dark:hover:bg-neutral-600 justify-center items-center">
          <>
            {!preview?(
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Icon className="w-5 h-5"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuRadioGroup value={propertyType} onValueChange={onChangePropertyType}>
                    {propertyTypes.map((item, index) => (
                      <DropdownMenuRadioItem key={index} value={item}
                                             className="text-xs pl-6 text-muted-foreground">{item}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ):(
              <Icon className="w-5 h-5"/>
            )}
          </>
        </div>

        {/*属性 Key*/}
        <ClickInput initialValue={item.key} onValueChangeEnd={onChangeKey} isLocked={preview}
                    inputClassName="h-8 w-32 text-gray-800 focus-visible:ring-transparent rounded-sm px-1"
                    textClassName="h-8 font-normal hover:bg-accent text-sm py-1 px-1 rounded-sm w-32"
                    isActive={isAdding}/>
      </div>

      {/*属性值*/}
      {/*文本类型*/}

      {propertyType === PropertyType.TEXT && (
        <>
        {!preview ? (
          <ClickInput initialValue={item.value ?? ""} onValueChangeEnd={onChangeValue} isLocked={preview}
                      placeholder="Empty"
                      inputClassName="h-8 focus-visible:ring-transparent rounded-sm px-2"
                      textClassName="h-8 w-full font-normal hover:bg-accent text-sm text-muted-foreground py-1 px-2 rounded-sm"/>
        ):(
          <div
            className="h-8 flex flex-1 flex-wrap items-center gap-1.5 w-full font-normal hover:bg-accent text-sm py-1 px-2.5 rounded-sm">
            <span>
              {item.value ?? ""}
            </span>
          </div>
        ) }
        </>
      )}

      {/*/!*文件类型*!/*/}
      {/*{propertyType === PropertyType.FILE && (*/}
      {/*  <ClickInput initialValue={item.value?? "-"} onValueChangeEnd={onChangeValue} isLocked={preview} inputType="file"*/}
      {/*              inputClassName="h-8 focus-visible:ring-transparent rounded-sm px-2"*/}
      {/*              textClassName="h-8 w-full font-normal hover:bg-accent text-sm text-muted-foreground py-1 px-2 rounded-sm"/>*/}
      {/*)}*/}

      {/*链接类型*/}
      {propertyType === PropertyType.LINK && (
        <>
          {!preview ? (
            <ClickInput initialValue={item.value ?? ""} onValueChangeEnd={onChangeValue}
                        inputType="url"
                        placeholder="https://"
                        inputClassName="h-8 focus-visible:ring-transparent rounded-sm px-2"
                        textClassName="h-8 w-full font-normal hover:bg-accent text-sm text-muted-foreground py-1 px-2 rounded-sm"/>
          ) : (
            <div
              className="h-8 flex flex-1 flex-wrap items-center gap-1.5 w-full font-normal hover:bg-accent text-sm py-1 px-2.5 rounded-sm">
              <Link className="w-4 h-4"/>
              <a href={item.value ?? "#"}>
                {item.value ?? "#"}
              </a>
            </div>
          )}

        </>

      )}
      {/*数字类型*/}
      {propertyType === PropertyType.NUMBER && (
        <ClickInput initialValue={item.value ?? ""} onValueChangeEnd={onChangeValue} isLocked={preview}
                    inputType="number" placeholder="0"
                    inputClassName="h-8 focus-visible:ring-transparent rounded-sm px-1"
                    textClassName="h-8 w-full font-normal hover:bg-accent text-sm text-muted-foreground py-1 px-2 rounded-sm"/>
      )}
      {/*日期类型*/}
      {propertyType === PropertyType.DATE && (
        <>
          {!preview ? (
            <div className="h-8 w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-sm border-0 shadow-none",
                            !date && "text-muted-foreground"
                          )}
                  >
                    <CalendarIcon/>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onChangeDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div
              className="flex flex-1 flex-wrap items-center gap-1.5 w-full font-normal hover:bg-accent text-sm py-1 px-2.5 rounded-sm">
              <CalendarIcon className="h-4 w-4"/>
              {date ? format(date, "PPP") : <span>Empty</span>}
            </div>
          )}
        </>

      )}
      {/*时间类型*/}
      {propertyType === PropertyType.DATETIME && (
        <>
          {!preview ? (
            <div className="h-8 w-full">
              <DateTimePicker value={date} onChange={onChangeDate}
                              className="-8 w-full justify-start text-left font-normal rounded-sm border-0 shadow-none"/>
            </div>
          ) : (
            <div
              className="flex flex-1 flex-wrap items-center gap-1.5 w-full font-normal hover:bg-accent text-sm py-1 px-2.5 rounded-sm">
              <CalendarIcon className="h-4 w-4"/>
              {date ? format(date, "PPP p") : <span>Empty</span>}
            </div>
          )}
        </>

      )}

      {/*多选类型*/}
      {propertyType === PropertyType.MULTI_SELECT && (
        <>
          {!preview ? (
            <AddableSelect options={options} value={optionValue} onChange={onChangeSelect} onAdd={onAddOption}
                           placeholder="Select an option or create one" allowMultiple={true}/>
          ) : (
            <div
              className="h-8 flex flex-1 flex-wrap items-center gap-1 w-full font-normal hover:bg-accent text-sm py-1 px-2 rounded-sm">
              {options.filter((option) => optionValue.includes(option.value)).map((option) => (
                <Badge key={option.value} className={cn("px-2 py-0.5 text-sm border rounded-xs", option.bg_color)}>
                  {option.label}
                </Badge>
              ))}
            </div>
          )}
        </>

      )}
      {/*单选类型*/}
      {(propertyType === PropertyType.SELECT) && (
        <>
          {!preview ? (
            <AddableSelect options={options} value={optionValue} onChange={onChangeSelect} onAdd={onAddOption}
                           placeholder="Choose one option" allowMultiple={false}/>
          ) : (
            <div
              className="h-8 flex flex-1 flex-wrap items-center gap-1 w-full font-normal hover:bg-accent text-sm py-1 px-2 rounded-sm">
              {options.filter((option) => optionValue.includes(option.value)).map((option) => (
                <Badge key={option.value} className={cn("px-2 py-0.5 text-sm border rounded-xs", option.bg_color)}>
                  {option.label}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
