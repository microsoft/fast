import { createRequire } from "node:module";
import { resolve } from "node:path";
import { types } from "node:util";

const bufferBackingStore = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Uint8Array.prototype),
    "buffer",
).get;

function inputBuffer(value, code) {
    if (
        types.isProxy(value) ||
        !Buffer.isBuffer(value) ||
        types.isSharedArrayBuffer(bufferBackingStore.call(value))
    ) {
        throw Object.assign(new TypeError("Expected an unshared Buffer."), { code });
    }
    return value;
}

function invalidOptions(message = "Expected a plain native render-options object.") {
    return Object.assign(new TypeError(message), { code: "invalid-options" });
}

function optionsJson(options = {}) {
    if (
        options === null ||
        typeof options !== "object" ||
        types.isProxy(options) ||
        ![null, Object.prototype].includes(Object.getPrototypeOf(options))
    ) {
        throw invalidOptions();
    }
    const descriptors = Object.getOwnPropertyDescriptors(options);
    const fields = [];
    for (const name of Reflect.ownKeys(descriptors)) {
        const descriptor = descriptors[name];
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
            throw invalidOptions();
        }
        const value = descriptor.value;
        let encoded;
        switch (name) {
            case "markersV2":
                if (value !== undefined && typeof value !== "boolean") {
                    throw invalidOptions();
                }
                break;
            case "attributeNameStrategy":
                if (value !== undefined && value !== "camelCase" && value !== "none") {
                    throw invalidOptions();
                }
                break;
            case "maxOutputBytes":
            case "maxSteps":
                if (value !== undefined && (!Number.isSafeInteger(value) || value < 0)) {
                    throw invalidOptions();
                }
                break;
            case "dsd": {
                if (value === undefined) break;
                if (
                    types.isProxy(value) ||
                    !Array.isArray(value) ||
                    Object.getPrototypeOf(value) !== Array.prototype
                ) {
                    throw invalidOptions();
                }
                if (Reflect.ownKeys(value).length !== value.length + 1) {
                    throw invalidOptions();
                }
                const names = [];
                for (let index = 0; index < value.length; index++) {
                    const item = Object.getOwnPropertyDescriptor(value, index);
                    if (
                        !item?.enumerable ||
                        !Object.hasOwn(item, "value") ||
                        typeof item.value !== "string" ||
                        !item.value.isWellFormed()
                    ) {
                        throw invalidOptions();
                    }
                    names.push(JSON.stringify(item.value));
                }
                encoded = `[${names.join(",")}]`;
                break;
            }
            default:
                throw invalidOptions();
        }
        if (value !== undefined) {
            fields.push(`${JSON.stringify(name)}:${encoded ?? JSON.stringify(value)}`);
        }
    }
    return `{${fields.join(",")}}`;
}

/** Load only the caller-selected, source-built addon. No download or backend fallback. */
export function loadNativeHost(addonPath) {
    const addon = createRequire(import.meta.url)(resolve(addonPath));
    if (typeof addon.NativeProgram !== "function") {
        throw new TypeError("Expected a FAST node-host addon.");
    }
    return class NativeProgram {
        #program;

        constructor(artifact, options) {
            this.#program = new addon.NativeProgram(
                inputBuffer(artifact, "invalid-artifact"),
                optionsJson(options),
            );
        }

        renderEntryJson(state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderEntryJson(inputBuffer(state, "invalid-state"));
        }

        renderTemplateJson(state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderTemplateJson(inputBuffer(state, "invalid-state"));
        }

        renderHostJson(name, state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderHostJson(
                name,
                inputBuffer(state, "invalid-state"),
            );
        }

        renderShadowJson(name, state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderShadowJson(
                name,
                inputBuffer(state, "invalid-state"),
            );
        }
    };
}
