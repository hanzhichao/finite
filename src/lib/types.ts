import {LucideIcon} from "lucide-react";

export interface Note {
  id: string,
  title: string,
  type?: string,
  icon?: string,
  cover?: string,
  tags?: string,
  content?: string,
  parent?: number,
  is_archived?: number,
  is_favorite?: number,
  is_locked?: number,
  create_at?: string,
  update_at?: string,
  properties?: Property[]
}

export enum PropertyType {
  TEXT= "Text",
  NUMBER = "Number",
  SELECT = "Select",  // circle-chevron-down
  MULTI_SELECT = "Multi Select",  // square-chevron-down
  DATE="Date",  // icon: calendar
  DATETIME = "DateTime",  // clock
  // STATUS = "Status",  // loader
  // TAG = "Tag",  // tags or tag
  LINK = "Link",  // link or link2 or external-link
  FILE = "File",
  // BOOL,
}

export interface Option {
  text: string,
  value: string,
  color: string,
  bg_color: string,
}


export interface Property {
  id: string,
  note_id?: string,
  key: string,
  type: PropertyType,
  value?: string,
  options?: Option[],
  is_readonly?: boolean,
  is_visible?: boolean
}
