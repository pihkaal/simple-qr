import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";
import { z } from "zod";
import { resolve } from "path";
import sharp from "sharp";

const time = (label: string) => {
  const start = performance.now();
  return () => {
    console.log(`${label}\t${performance.now() - start}`);
  };
};

const IMAGE_FORMATS = ["jpeg", "png", "webp"] as const;

const settingsSchema = z.object({
  format: z.enum(IMAGE_FORMATS).default("png"),
  logo: z.string().min(1),
  content: z.string().min(1),
});

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

  const tt = time("total");
  let t;

  const SIZE = 1000;
  const LOGO_PADDING = 1;

  t = time("render");
  const canvas = createCanvas(SIZE, SIZE);
  await QRCode.toCanvas(canvas, content, {
    errorCorrectionLevel: "H",
    width: SIZE,
    margin: 1,
  });
  t();

  t = time("count");
  const qrCode = QRCode.create(content, { errorCorrectionLevel: "H" });
  const moduleCount = qrCode.modules.size + 2;
  t();

  t = time("logo");
  const logoImage = await loadImage(resolve("public", `${logo}.png`));

  const moduleSize = SIZE / moduleCount;

  let logoModules = Math.floor(moduleCount * 0.3);
  if (logoModules % 2 !== moduleCount % 2) {
    logoModules += 1;
  }

  const backgroundSize = logoModules * moduleSize + 1;
  const backgroundPosition = (moduleSize * (moduleCount - logoModules)) / 2;

  const logoSize = backgroundSize - LOGO_PADDING * 2;
  const logoPosition = backgroundPosition + LOGO_PADDING;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(
    backgroundPosition,
    backgroundPosition,
    backgroundSize,
    backgroundSize,
  );
  ctx.drawImage(logoImage, logoPosition, logoPosition, logoSize, logoSize);
  t();

  t = time("buffer");
  let image = canvas.toBuffer();
  t();

  if (format !== "png") {
    t = time("convert");
    image = await sharp(image).toFormat(format).toBuffer();
    t();
  }

  tt();

  event.node.res.setHeader("Content-Type", `image/${format}`);
  return image;
});

