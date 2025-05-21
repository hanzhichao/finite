import {NavItem} from "@/components/sidebar/nav-item";
import {PlusCircle, Search, Settings} from "lucide-react";
import React from "react";
import {useSettings} from "@/hooks/use-settings";
import {useSearch} from "@/hooks/use-search";

interface NavItemsProps {
  onCreateNote: () => void
}

export const NavItems = ({onCreateNote}: NavItemsProps)=> {
  const settings = useSettings();
  const search = useSearch();
  return (
    <div className="mt-4">
      <NavItem label="Search" icon={Search} hotkey="K" onClick={search.onOpen}/>
      <NavItem label="Settings" icon={Settings} onClick={settings.onOpen} />
      <NavItem label="New page" icon={PlusCircle} onClick={onCreateNote} />
    </div>
  )
}