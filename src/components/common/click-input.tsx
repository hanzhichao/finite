"use client"

import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";

interface ClickInputProps {
  initialValue: string;
  inputType?: string;
  onValueChange?: (value: string) => void;
  onValueChangeEnd?: (value: string) => void;
  inputClassName?: string
  textClassName?: string
  isLocked?: boolean
  isActive?: boolean
  placeholder?: string
}

export const ClickInput = ({
                             initialValue,
                             inputType="text",
                             onValueChange,
                             onValueChangeEnd,
                             inputClassName,
                             textClassName,
                             isLocked = false,
                             isActive,
                             placeholder = "",
                           }: ClickInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log(`加载 ClickInput组件：${initialValue}`)
    setValue(initialValue)
    if (isActive ) enableInput()
  }, []);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      // inputRef.current?.setSelectionRange(0, 0)
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
    if (typeof onValueChangeEnd !== "undefined") {
      onValueChangeEnd(value);
    }
  }

  const onChange = (newValue: string) => {
    setValue(newValue);
    if (typeof onValueChange !== "undefined") onValueChange(newValue)
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <>
      {(isEditing && !isLocked) ? (
        <Input type={inputType} ref={inputRef} onClick={enableInput} onBlur={disableInput} onKeyDown={onKeyDown} onChange={(e)=>{ onChange(e.target.value); }}
               value={value} className={inputClassName ?? ""} placeholder={placeholder}/>
      ) : (
        <div onClick={enableInput} className={textClassName ?? ""}>
          <span className="truncate">{value}</span>
        </div>)}
    </>
  )
}
