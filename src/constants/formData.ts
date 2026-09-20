import z from "zod";
import { loginCustomerSchema, registerCustomerSchema } from "./schema";

export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;
export type LoginCustomerFormData = z.infer<typeof loginCustomerSchema>;
