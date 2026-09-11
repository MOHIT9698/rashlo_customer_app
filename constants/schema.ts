import z from "zod";

export const registerCustomerSchema = z
    .object({
        first_name: z
            .string()
            .min(3, "First name must be at least 3 characters")
            .regex(
                /^[a-zA-Z ]+$/,
                "First name can only contain letters and spaces"
            ),

        mobile_number: z
            .string()
            .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

        last_name: z
            .string()
            .min(3, "Last name must be at least 3 characters")
            .regex(
                /^[a-zA-Z ]+$/,
                "Last name can only contain letters and spaces"
            ),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),

        confirm_password: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });


export const loginCustomerSchema = z.object({
    mobile_number: z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});