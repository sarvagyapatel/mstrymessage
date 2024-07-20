import {z} from 'zod'

export const messageSchema = z.object({
    constent: z.string().min(5, "message should at least be 5 characters").max(500, "message could not exceeed 500 characters")
})