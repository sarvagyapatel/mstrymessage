import {z} from 'zod'

export const usernameValidation = z
   .string()
   .min(2, "username must contain at least 2 characters")
   .max(20, "username must  not excesd 20 characters")
   .regex(/^[a-zA-Z-0-9]+$/,"username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must contain 6 charcters"})
})