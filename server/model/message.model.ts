import z from "zod";

export const messageModel = z.object({
    id: z.uuid(),
    name: z.string().min(1).max(255),
    email: z.email(),
    subject: z.string().min(1).max(255),
    message: z.string().min(1),
    status: z.enum(["unread", "read"]),
    created_at: z.string(),
    deleted_at: z.string().nullable().optional(),
})

export type MessageModel = z.infer<typeof messageModel>;

export const createMessageSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.email(),
    subject: z.string().min(1).max(255),
    message: z.string().min(1),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export const updateMessageStatusSchema = z.object({
    status: z.enum(["unread", "read"]),
    id: z.uuid(),
});

export type UpdateMessageStatusInput = z.infer<typeof updateMessageStatusSchema>;

