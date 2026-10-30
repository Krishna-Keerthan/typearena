import { execSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(scriptDir, "..");
const sourceSchema = path.resolve(serverDir, "..", "prisma", "schema.prisma");
const targetDir = path.resolve(serverDir, "prisma");
const targetSchema = path.resolve(targetDir, "schema.prisma");

const schema = await readFile(sourceSchema, "utf8");
const synced = schema.replace(
  /output\s*=\s*"[^"]*"/,
  'output   = "../node_modules/.prisma/client"'
);

await mkdir(targetDir, { recursive: true });
await writeFile(targetSchema, synced);

console.log("[prisma] generated server schema from root schema");
execSync("npx prisma generate --schema prisma/schema.prisma", {
  cwd: serverDir,
  stdio: "inherit",
});
