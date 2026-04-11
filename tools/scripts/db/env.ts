import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const scriptsEnvPath = resolve(currentDir, "..", ".env");
const rootEnvPath = resolve(currentDir, "..", "..", "..", ".env");

config({ path: rootEnvPath });
config({ path: scriptsEnvPath, override: true });
