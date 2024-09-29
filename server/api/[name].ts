import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";

const time = (label: string) => {
  const start = performance.now();
  return () => {
    console.log(label, "\t", performance.now() - start);
  }
}

export default defineEventHandler(async (event) => {
  // TODO: define logo based on name
  const name = getRouterParam(event, "name");
  name;

  const text = "https://pihkaal.me"

  event.node.res.setHeader("Content-Type", "text/plain");

  const tt = time("total");
  let t;

  const SIZE = 1000;
  const LOGO_PADDING = 1;

  t = time("render");
  const canvas = createCanvas(SIZE, SIZE);
  await QRCode.toCanvas(canvas, text, { errorCorrectionLevel: 'H', width: SIZE, margin: 1 });
  t();

  t = time("count");
  const qrCode = QRCode.create(text, { errorCorrectionLevel: 'H' });
  const moduleCount = qrCode.modules.size + 2;
  t();

  t = time("logo");
  const logo = await loadImage("http://localhost:3000/session.png");

  const moduleSize = SIZE / moduleCount;

  let logoModules = Math.floor(moduleCount * 0.3);
  if (logoModules % 2 !== moduleCount % 2) {
    logoModules += 1;
  }

  const backgroundSize = logoModules * moduleSize + 1;
  const backgroundPosition = moduleSize * (moduleCount - logoModules) / 2;

  const logoSize = backgroundSize - LOGO_PADDING * 2;
  const logoPosition = backgroundPosition + LOGO_PADDING;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(backgroundPosition, backgroundPosition, backgroundSize, backgroundSize);
  ctx.drawImage(logo, logoPosition, logoPosition, logoSize, logoSize);
  t();

  t = time("buffer");
  const image = canvas.toBuffer();
  t();

  tt();

  return image;
});
