export interface ProjectPreviewImage {
    url: string
    title?: string
    caption?: string
}

export interface ProjectPreviewInput {
    id?: string
    url?: string
    file?: File | null
    previewUrl?: string
    title?: string
    caption?: string
}

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
    preview_images?: ProjectPreviewImage[] // Gallery/feature preview images with title & caption
}

export type ProjectsResponse = {
    data: Project[]
    has_next: boolean
}