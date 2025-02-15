import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

export const saveImage = async (
  fileName: string,
  fileBase64: string,
  folder: string
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const buffer = Buffer.from(fileBase64, "base64");

  const newFilename = `${Date.now()}-${fileName}`;

  const filePath = path.join(
    path.resolve(__dirname, "../../"),
    folder,
    newFilename
  );

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);

  return newFilename;
};
