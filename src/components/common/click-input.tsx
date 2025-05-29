"use client"

import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface ClickInputProps {
  initialValue: string
  onChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  inputClassName?: string
  textClassName?: string
  useTextArea?: boolean
}

export const ClickInput = ({
                             initialValue,
                             onChange,
                             onChangeEnd,
                             inputClassName,
                             textClassName,
                             useTextArea
                           }: ClickInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setValue(initialValue);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, 0)
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
    if (typeof onChangeEnd !== "undefined") onChangeEnd(value)
  }

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (typeof onChange !== "undefined") onChange(value)
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <>
      {isEditing ? (
        <Input ref={inputRef} onClick={enableInput}
               onBlur={disableInput}
               onKeyDown={onKeyDown}
               onChange={onValueChange}
               value={value}
               className={inputClassName ?? ""}/>
      ) : (
        <div onClick={enableInput} className={textClassName ?? ""}>
          <span className="truncate">{value}</span>
        </div>)}
    </>
  )
}
