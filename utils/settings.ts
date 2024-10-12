import { z } from "zod";

// TODO: might be better to load these dynamically lol
export const LOGOS = [
  "bereal",
  "bitcoin",
  "buymeacoffee",
  "diaspora",
  "discord",
  "dropbox",
  "ello",
  "facebook",
  "flickr",
  "github",
  "googlemaps",
  "googlemeet",
  "googlemessages",
  "imessage",
  "instagram",
  "kik",
  "line",
  "linkedin",
  "litecoin",
  "mastodon",
  "medium",
  "messenger",
  "monero",
  "onlyfans",
  "patreon",
  "paypal",
  "peertube",
  "pinterest",
  "reddit",
  "session",
  "signal",
  "snapchat",
  "spotify",
  "substack",
  "telegram",
  "threema",
  "twitch",
  "venmo",
  "viber",
  "wechat",
  "whatsapp",
  "x",
  "youtube",
  "zoom",
] as const;

export const IMAGE_FORMATS = ["png", "jpeg", "webp"] as const;

export type ImageFormat = (typeof IMAGE_FORMATS)[number];

export const settingsSchema = z.object({
  format: z.enum(IMAGE_FORMATS).default("png"),
  logo: z.enum(LOGOS).optional(),
  content: z.string().min(1, "Required"),
});

export type Settings = z.infer<typeof settingsSchema>;
