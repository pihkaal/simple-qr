import { createCanvas } from "canvas";
import { resolve } from "path";
import sharp from "sharp";
import { CANVAS_SIZE, renderQRCodeToCanvas } from "~/utils/renderer";
import { settingsSchema } from "~/utils/settings";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const parsed = settingsSchema.safeParse(query);
  if (!parsed.success) {
    return createError({
      status: 400,
      data: {
        errors: Object.fromEntries(
          parsed.error.errors.map((x) => [x.path.join("."), x.message]),
        ),
      },
    });
  }

  const { format, logo, content } = parsed.data;

  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const logoUrl = logo ? resolve("public", `logos/${logo}.png`) : undefined;
  await renderQRCodeToCanvas(canvas, content, logoUrl);

  let image = canvas.toBuffer();
  if (format !== "png") {
    image = await sharp(image).toFormat(format).toBuffer();
  }

  event.node.res.setHeader("Content-Type", `image/${format}`);
  return image;
});
