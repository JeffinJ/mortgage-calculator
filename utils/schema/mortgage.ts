import { z } from "zod";

export const CalculateMortgageFormSchema = z
    .object({
        price: z.number({
            required_error: "Property price is required",
            invalid_type_error: "Property price must be a number"
        })
            .nonnegative("Price must be a positive number")
            .max(100000000, "Property price must be less than £100,000,000"),

        deposit: z.number({
            invalid_type_error: "Deposit must be a number"
        })
            .nonnegative("Deposit must be a positive number")
            .optional()
            .default(0),

        term: z.number({
            required_error: "Mortgage term is required",
            invalid_type_error: "Term must be a number"
        })
            .min(1, "Term must be at least 1 year")
            .max(40, "Term cannot exceed 40 years")
            .int("Term must be a whole number"),

        interest: z.number({
            required_error: "Interest rate is required",
            invalid_type_error: "Interest rate must be a number"
        })
            .nonnegative("Interest rate must be a positive number")
            .max(100, "Interest rate cannot exceed 100%")
    })
    .superRefine((data, ctx) => {
        if (data.deposit && data.deposit > data.price) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Deposit cannot be greater than property price",
                path: ["deposit"]
            });
        }
    });