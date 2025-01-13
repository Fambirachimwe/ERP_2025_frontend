import * as z from "zod";

export const assetSchema = z.object({
    model: z.string().min(1, "Model is required"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    location: z.string().min(1, "Location is required"),
    department: z.string().min(1, "Department is required"),
    status: z.enum(["active", "inactive", "disposed"]),
    version: z.string().optional(),
    licenseKey: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>; 