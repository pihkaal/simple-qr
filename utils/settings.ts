import { z } from "zod";

export const LOGOS = ["session", "instagram"] as const;

export const IMAGE_FORMATS = ["png", "jpeg", "webp"] as const;

export type ImageFormat = (typeof IMAGE_FORMATS)[number];

export const settingsSchema = z.object({
  format: z.enum(IMAGE_FORMATS).default("png"),
  logo: z.enum(LOGOS),
  content: z.string().min(1, "Required"),
});

export type Settings = z.infer<typeof settingsSchema>;
