import z from "zod";

export const journeyModel = z.object({
    id: z.number(),
    title: z.string().min(1).max(255),
    company: z.string().min(1).max(255),
    location: z.string().max(255).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    key_responsibilities: z.array(z.string()),
    description: z.string().max(5000).optional(),
    attachments: z.string().max(255).optional(),
    is_current: z.boolean(),
    id_skills: z.array(z.number()).optional(),
    created_at: z.string(),
    updated_at: z.string(),
})

export type JourneyModel = z.infer<typeof journeyModel>;

export const createJourneySchema = z.object({
    title: z.string().min(1).max(255),
    company: z.string().min(1).max(255),
    location: z.string().max(255).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional().nullable(),
    key_responsibilities: z.array(z.string()).min(1),
    description: z.string().max(5000).optional(),
    attachments: z.string().max(255).optional(),
    is_current: z.boolean(),
    id_skills: z.array(z.number()).optional(),
});

export type CreateJourneyInput = z.infer<typeof createJourneySchema>;

export const updateJourneySchema = z.object({
    id: z.number(),
    title: z.string().min(1).max(255),
    company: z.string().min(1).max(255),
    location: z.string().max(255).optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional().nullable(),
    key_responsibilities: z.array(z.string()).min(1),
    description: z.string().max(5000).optional(),
    attachments: z.string().max(255).optional(),
    is_current: z.boolean(),
    id_skills: z.array(z.number()).optional(),
});

export type UpdateJourneyInput = z.infer<typeof updateJourneySchema>;

