import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
})