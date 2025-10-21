import z from "zod";

const createPatientValidationZodSchema = z.object({
    password: z.string(),
    patient: {
        name: z.string({error: "Name is required"})
    },
    email: z.email({error: "Email is invalid"}),
    address: z.string().optional()
})

export const UserValidation = {
    createPatientValidationZodSchema
}