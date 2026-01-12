import z from "zod";
import {fileSchema} from "~~/server/utils/common";

export const projectModel = z.object({
    id: z.number(),
    name: z.string().min(1).max(255),
    image: z.string(), // Max 5MB
    description: z.string().min(1).max(5000).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}).optional(),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    status: z.enum(["Draft", "Published"]),
    features: z.array(z.string()),
    live_url: z.url().optional(),
    repo_url: z.url().optional(),
    skills: z.array(z.string()),
    created_at: z.string(),
})

export type ProjectModel = z.infer<typeof projectModel>;

export const createProjectSchema = z.object({
    name: z.string().min(1).max(255),
    image: fileSchema, // Max 5MB
    url: z.string().nullable().optional(),
    description: z.string().min(1).max(5000).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}).optional(),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    status: z.boolean(),
    features: z.array(z.string()),
    id_skills: z.array(z.number()),
    live_url: z.url().optional(),
    repo_url: z.url().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(255),
    image: fileSchema.optional(), // Max 5MB
    description: z.string().min(1).max(5000).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}).optional(),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    status: z.boolean(),
    features: z.array(z.string()),
    url: z.string().nullable().optional(),
    live_url: z.url().optional(),
    id_skills: z.array(z.number()),
    repo_url: z.url().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;