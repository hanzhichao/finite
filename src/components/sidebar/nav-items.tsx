import {NavItem} from "@/components/sidebar/nav-item";
import {Home, PlusCircle, Search, Settings} from "lucide-react";
import React from "react";
import {useSettings} from "@/hooks/use-settings";
import {useSearch} from "@/hooks/use-search";
import {useRouter} from "next/navigation";
import {useActiveNote} from "@/hooks/use-active-note";

interface NavItemsProps {
  onCreateNote: () => void
}

export const NavItems = ({onCreateNote}: NavItemsProps)=> {
  const settings = useSettings();
  const search = useSearch();
  const route = useRouter();
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)

  const showHomePage = () => {
    // route.push("/home")
    setActiveNoteId(undefined)

  }


  return (
    <div className="mt-4">
      <NavItem label="Search" icon={Search} hotkey="K" onClick={search.onOpen}/>
      <NavItem label="Settings" icon={Settings} onClick={settings.onOpen} />
      <NavItem label="Home" icon={Home} onClick={()=>{showHomePage()}} />
      <NavItem label="New page" icon={PlusCircle} hotkey="N" onClick={onCreateNote} />
    </div>
  )
}