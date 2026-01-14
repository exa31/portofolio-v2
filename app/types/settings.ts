export type UserSettingsModel = {
    id: string;
    name: string;
    email: string;
    location?: string | null;
    open_to_opportunities: boolean;
    github_profile?: string | null;
    linkedin_profile?: string | null;
    created_at: string;
    updated_at: string;
    cv_url: string;
}