export type Skill = {
    id: number;
    name: string;
    color: string;
    icon: string;
};

export type SkillsResponse = {
    data: Skill[]
    has_next: boolean
}