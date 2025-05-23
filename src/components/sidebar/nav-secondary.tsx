"use client"

import {Import,Trash} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {NavItem} from "@/components/sidebar/nav-item";
import {useImport} from "@/hooks/use-import";
import TrashBox from "@/components/sidebar/trash-box";

interface NavTrashProps {
  isMobile: boolean
}

export const NavSecondary = ({isMobile}: NavTrashProps) => {
  const importDialog = useImport();
  return (
    <div className="mt-10">
      <NavItem label="Import" icon={Import} onClick={importDialog.onOpen}/>
      <Popover>
        <PopoverTrigger className="w-full">
          <NavItem label="Trash" icon={Trash} />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-100 " side={isMobile ? "bottom" : "right"}>
          <TrashBox />
        </PopoverContent>
      </Popover>
    </div>
  )
}