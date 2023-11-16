import z from "zod"

const descMax : number = 1023;



export default class QuestionValidator {
    static questionTemplate = z.object({
        description: z.string().min(1, { message: "Description required" })
                        .max(descMax, { message: "No more than " + descMax + " characters" })
                        .regex(new RegExp(/^[a-zA-Z0-9]+$/),'Special characters not allowed'),
        
    })
}