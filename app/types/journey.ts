export type Journey = {
    id?: number
    title: string
    company: string
    location?: string
    start_date: string
    end_date?: string
    key_responsibilities: string[]
    description?: string
    attachments?: string
    is_current: boolean
    created_at?: string
    updated_at?: string
    id_skills?: number[] // For storing skill associations
}

export type JourneysResponse = {
    data: Journey[]
    has_next: boolean
}

