export type Project = {
    id?: number
    name: string
    description: string
    image: File | null
    status: boolean
    features: string[]
    technologies: string[]
    repo_url?: string
    live_url?: string
    start_date?: string
    end_date?: string
    created_at: string
    updated_at: string
    id_skills?: number[] // For backward compatibility
    preview_image?: string // URL of the image for preview purposes
}

export type ProjectsResponse = {
    data: Project[]
    has_next: boolean
}