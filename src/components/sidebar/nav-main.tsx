import {NavItem} from "@/components/sidebar/nav-item";
import {CalendarDays, Home, PlusCircle, Search, Settings} from "lucide-react";
import React from "react";
import {useSettings} from "@/hooks/use-settings";
import {useSearch} from "@/hooks/use-search";
import {useActiveNote} from "@/hooks/use-active-note";
import { useTranslation } from "react-i18next";

interface NavItemsProps {
  onCreateNote: () => void
}

export const NavMain = ({onCreateNote}: NavItemsProps)=> {
  const settings = useSettings();
  const search = useSearch();
  const setActiveNoteId = useActiveNote((store)=> store.setActiveNoteId)
  const activeNoteId = useActiveNote((store)=> store.activeNoteId)
  const isCalendarView = useActiveNote((store)=> store.isCalendarView)
  const setMindView = useActiveNote((store)=> store.setMindView)
  const setSubNotesView = useActiveNote((store)=> store.setSubNotesView)
  const setCalendarView = useActiveNote((store)=> store.setCalendarView)
  const { t } = useTranslation();

  const showHomePage = () => {
    setCalendarView(false)
    setMindView(false)
    setSubNotesView(false)
    setActiveNoteId(undefined)
  }

  const showCalendar = () => {
    setCalendarView(true)
    setMindView(false)
    setSubNotesView(false)
  }

  return (
    <div className="pt-4">
      <NavItem label={t("Search")} icon={Search} hotkey="K" onClick={search.onOpen} active={search.isOpen}/>
      <NavItem label={t("Settings")} icon={Settings} onClick={settings.onOpen} active={settings.isOpen}/>
      <NavItem label={t("Home")} icon={Home} onClick={()=>{showHomePage()}} active={!search.isOpen && !settings.isOpen && typeof activeNoteId=== "undefined" && !isCalendarView}/>
      <NavItem label={t("Calendar")} icon={CalendarDays} onClick={showCalendar} active={isCalendarView}/>
      <NavItem label={t("New page")} icon={PlusCircle} hotkey="N" onClick={onCreateNote} />
    </div>
  )
}