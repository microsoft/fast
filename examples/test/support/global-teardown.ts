import { promises as fs } from "node:fs";
import { SSR_STATE_BACKUP, SSR_STATE_FILE } from "./global-setup.js";

export default async function globalTeardown(): Promise<void> {
    try {
        const backup = await fs.readFile(SSR_STATE_BACKUP, "utf8");
        await fs.writeFile(SSR_STATE_FILE, backup, "utf8");
        await fs.unlink(SSR_STATE_BACKUP);
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
            throw err;
        }
    }
}
