import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Produto from "../src/models/Produto.js";

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const getUploadsDir = () => path.resolve(process.cwd(), "uploads");

const isAllowed = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  return ALLOWED_EXT.has(ext);
};

const getReferencedFileNames = async () => {
  const produtos = await Produto.find({ imagem: { $exists: true, $ne: "" } })
    .select("imagem")
    .lean();

  const set = new Set();
  for (const p of produtos) {
    const img = p?.imagem;
    if (typeof img !== "string") continue;
    if (!img.startsWith("/uploads/")) continue;
    set.add(path.basename(img));
  }
  return set;
};

const gc = async () => {
  const uploadsDir = getUploadsDir();
  const quarantineHours = Number(process.env.UPLOADS_GC_QUARANTINE_HOURS || 12);
  const quarantineMs = Math.max(0, quarantineHours) * 60 * 60 * 1000;
  const now = Date.now();

  if (!fs.existsSync(uploadsDir)) {
    console.log(`[gcUploads] uploads dir not found: ${uploadsDir}`);
    return;
  }

  const referenced = await getReferencedFileNames();
  const files = fs.readdirSync(uploadsDir);

  let scanned = 0;
  let deleted = 0;
  let skippedRecent = 0;
  let skippedReferenced = 0;
  let skippedNotAllowed = 0;

  for (const fileName of files) {
    scanned++;

    if (!isAllowed(fileName)) {
      skippedNotAllowed++;
      continue;
    }

    if (referenced.has(fileName)) {
      skippedReferenced++;
      continue;
    }

    const fullPath = path.join(uploadsDir, fileName);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (quarantineMs && now - stat.mtimeMs < quarantineMs) {
      skippedRecent++;
      continue;
    }

    try {
      fs.unlinkSync(fullPath);
      deleted++;
    } catch {
      // ignore
    }
  }

  console.log(
    `[gcUploads] scanned=${scanned} deleted=${deleted} skippedReferenced=${skippedReferenced} skippedRecent=${skippedRecent} skippedNotAllowed=${skippedNotAllowed}`,
  );
};

await connectDB();
await gc();
await mongoose.connection.close();

