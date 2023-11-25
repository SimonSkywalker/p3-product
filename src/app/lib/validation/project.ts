import { z } from 'zod'

/**
 * Schema checks for special characters, min/max length and trims whitespace
 **/
export const validateProjectData = z.object({
  title: z.string()
  .regex(new RegExp(/^[a-zA-Z0-9_ ]+$/),'Special characters not allowed')
  .trim()
  .min(2)
  .max(20)
  });