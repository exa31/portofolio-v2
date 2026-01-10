import z from 'zod';

export const userModel = z.object({
    id: z.uuidv4(),
    name: z.string().min(1).max(100),
    email: z.email(),
})

export type UserModel = z.infer<typeof userModel>;

export const loginRequestModel = z.object({
    token_id: z.string().min(1),
})