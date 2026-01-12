export type Project = {
    id?: number
    name: string
    description: string
    image: File | null
    status: boolean
    features: string[]
    technologies: number[]
    repo_url?: string
    live_url?: string
    start_date: string
    end_date?: string
}

export type ProjectsResponse = {
    data: Project[]
    has_next: boolean
}