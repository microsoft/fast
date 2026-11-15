import { createRequire } from "node:module";
import { resolve } from "node:path";
import { types } from "node:util";
import { preparedRequest, prepareState } from "./server-runtime.mjs";

const bufferBackingStore = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Uint8Array.prototype),
    "buffer",
).get;

function sharedBuffer(value) {
    return (
        Buffer.isBuffer(value) &&
        types.isSharedArrayBuffer(bufferBackingStore.call(value))
    );
}

function jsonInput(value, code) {
    if (
        (typeof value !== "string" && !Buffer.isBuffer(value)) ||
        (typeof value === "string" && !value.isWellFormed()) ||
        sharedBuffer(value)
    ) {
        throw Object.assign(
            new TypeError(
                "Expected well-formed JSON text or an unshared strict UTF-8 Buffer.",
            ),
            { code },
        );
    }
    return value;
}

/** Explicitly validate and serialize JSON-shaped objects; never invoke getters/toJSON. */
export function serializeNativeState(state = {}) {
    try {
        const snapshot = preparedRequest(prepareState(state))[0].values;
        function encode(value) {
            if (value === null || typeof value !== "object") {
                return JSON.stringify(value);
            }
            if (Array.isArray(value)) {
                return `[${value.map(encode).join(",")}]`;
            }
            return `{${Object.keys(value)
                .map(key => `${JSON.stringify(key)}:${encode(value[key])}`)
                .join(",")}}`;
        }
        return encode(snapshot);
    } catch (error) {
        error.code = "invalid-state";
        throw error;
    }
}

/** Load only the caller-selected, source-built addon. No download or backend fallback. */
export function loadNativeHost(addonPath) {
    const addon = createRequire(import.meta.url)(resolve(addonPath));
    if (typeof addon.NativeProgram !== "function") {
        throw new TypeError("Expected a FAST node-host addon.");
    }
    return class NativeProgram {
        #program;

        constructor(artifact) {
            if (!Buffer.isBuffer(artifact) || sharedBuffer(artifact)) {
                throw Object.assign(
                    new TypeError(
                        "Expected executable artifact bytes as an unshared Buffer.",
                    ),
                    { code: "invalid-artifact" },
                );
            }
            this.#program = new addon.NativeProgram(artifact);
        }

        #render(method, state, options, name) {
            state = jsonInput(state, "invalid-state");
            // Let Rust validate JSON state before reporting malformed options.
            if (
                (typeof options === "string" && !options.isWellFormed()) ||
                sharedBuffer(options)
            ) {
                options = Buffer.from([0xff]);
            } else if (
                options !== undefined &&
                !Buffer.isBuffer(options) &&
                typeof options !== "string"
            ) {
                options = Buffer.from([0xff]);
            }
            return name === undefined
                ? this.#program[method](state, options)
                : this.#program[method](name, state, options);
        }

        renderEntryJson(state, options) {
            return this.#render("renderEntryJson", state, options);
        }

        renderTemplateJson(state, options) {
            return this.#render("renderTemplateJson", state, options);
        }

        renderHostJson(name, state, options) {
            return this.#render("renderHostJson", state, options, name);
        }

        renderShadowJson(name, state, options) {
            return this.#render("renderShadowJson", state, options, name);
        }
    };
}
