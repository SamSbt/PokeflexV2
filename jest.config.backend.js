import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "backend", ".env") });

export default {
	testEnvironment: "node",
	verbose: true,
	transform: {},
};


