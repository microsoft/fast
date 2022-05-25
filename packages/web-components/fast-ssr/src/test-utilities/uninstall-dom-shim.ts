/**
 * Uninstall a previously installed dom-shim.
 * This file is for testing purposes only.
 */
import { createWindow } from "../dom-shim.js";

if (globalThis.window !== undefined) {
    const keys = Object.keys(createWindow());
    (globalThis as any).window = undefined;

    for (const key of keys) {
        delete (globalThis as any)[key];
    }
}
