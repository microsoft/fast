import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { FullConfig } from "@playwright/test";

/**
 * The SSR webui-todo-app persists state to `examples/ssr/webui-todo-app/data/state.json`.
 * Tests will add/toggle/delete items there, mutating the file. Back it up
 * before the run and restore it after (see global-teardown.ts).
 */
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SSR_STATE_FILE = path.resolve(
    HERE,
    "../../ssr/webui-todo-app/data/state.json",
);
export const SSR_STATE_BACKUP = `${SSR_STATE_FILE}.e2e-backup`;

export default async function globalSetup(_config: FullConfig): Promise<void> {
    try {
        const original = await fs.readFile(SSR_STATE_FILE, "utf8");
        await fs.writeFile(SSR_STATE_BACKUP, original, "utf8");
    } catch (err) {
        // If the state file is missing we leave things alone; the SSR project
        // will simply fail to start and surface its own diagnostics.
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
            throw err;
        }
    }
}
