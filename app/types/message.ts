export type Message = {
    id?: string
    name: string
    email: string
    subject: string
    message: string
    status?: 'unread' | 'read'
    created_at?: string
    deleted_at?: string | null
}

export type MessagesResponse = {
    data: Message[]
    has_next: boolean
}

