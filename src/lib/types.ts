export interface Note {
    id: string,
    title: string,
    icon?: string,
    cover?: string,
    content?: string,
    parent?: number,
    is_archived?: number,
    is_favorite?: number,
    create_at?: string,
    update_at?: string
}