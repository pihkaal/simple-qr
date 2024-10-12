import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";

const CANVAS_SIZE = 1000;
const LOGO_PADDING = 1;

export const renderQRCodeToCanvas = async (
  content: string,
  logoUrl: string | undefined,
) => {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);

  await QRCode.toCanvas(canvas, content, {
    errorCorrectionLevel: "H",
    width: CANVAS_SIZE,
    margin: 1,
  });

  if (!logoUrl) return canvas;

  const qrCode = QRCode.create(content, { errorCorrectionLevel: "H" });
  const moduleCount = qrCode.modules.size + 2;

  const logoImage = await loadImage(logoUrl);

  const moduleSize = CANVAS_SIZE / moduleCount;

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

  return canvas;
};
