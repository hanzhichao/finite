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


export interface Property {
  id: string,
  note_id: string,
  key: string
  type?: string
  value?: string
}
