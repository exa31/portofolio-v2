import z from "zod";

export const paginationSchemaQuery = z.object({
    pagination: z.string().optional().transform(
        (val) => val === 'true'
    ),
    limit: z.string().optional().refine(
        (val) => {
            if (val === undefined) return true;
            const num = Number(val);
            return Number.isInteger(num) && num > 0 && num <= 100;
        },
        {message: 'limit_must_be_positive_integer_up_to_100'}
    ).transform((val) => val ? Number(val) : undefined
    ),
    cursor: z.string().optional().refine(
        (val) => {
            if (val === undefined || val === '') return true;
            const num = Number(val);
            return Number.isInteger(num) && num > 0 && num <= 100;
        },
        {message: 'limit_must_be_positive_integer_up_to_100'}
    ).transform((val) => val ? Number(val) : undefined
    ),
})