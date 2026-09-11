import z from "zod";

export const registerCustomerSchema = z.object({

    first_name: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .regex(/^[a-zA-Z ]+$/, "First name can only contain letters and spaces"),
    mobile_number: z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    last_name: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .regex(/^[a-zA-Z ]+$/, "Last name can only contain letters and spaces"),
});