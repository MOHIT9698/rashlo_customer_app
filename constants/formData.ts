import z from "zod";
import { registerCustomerSchema } from "./schema";

export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;
