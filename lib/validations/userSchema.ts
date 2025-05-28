import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

export const userSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  birthdate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Birthdate must be a valid date" }
  ),
  address: addressSchema,
});
