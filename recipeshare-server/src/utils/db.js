import fs from "fs-extra";
import { ENV } from "../config.js";

const defaultShape = {
  users: [],
  recipes: []
};

export async function ensureDatabase() {
  await fs.ensureFile(ENV.DATA_FILE);
  const exists = await fs.pathExists(ENV.DATA_FILE);
  if (!exists) {
    await fs.writeJson(ENV.DATA_FILE, defaultShape, { spaces: 2 });
  } else {
    const content = await fs.readFile(ENV.DATA_FILE, "utf-8");
    if (!content || content.trim() === "") {
      await fs.writeJson(ENV.DATA_FILE, defaultShape, { spaces: 2 });
    }
  }
  await fs.ensureDir(ENV.UPLOAD_DIR);
}

export async function readDb() {
  await ensureDatabase();
  return fs.readJson(ENV.DATA_FILE);
}

export async function writeDb(data) {
  return fs.writeJson(ENV.DATA_FILE, data, { spaces: 2 });
}


