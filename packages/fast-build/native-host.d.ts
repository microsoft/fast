/// <reference types="node" />

export interface NativeProgram {
    /** JSON Buffers must not be backed by SharedArrayBuffer. */
    renderEntryJson(state: string | Buffer, options?: string | Buffer): Buffer;
    renderTemplateJson(state: string | Buffer, options?: string | Buffer): Buffer;
    renderHostJson(
        name: string,
        state: string | Buffer,
        options?: string | Buffer,
    ): Buffer;
    renderShadowJson(
        name: string,
        state: string | Buffer,
        options?: string | Buffer,
    ): Buffer;
}

/** Explicit local addon path. Artifact Buffers must not be backed by SharedArrayBuffer. */
export function loadNativeHost(
    addonPath: string,
): new (
    artifact: Buffer,
) => NativeProgram;

/** Validates the complete graph before serialization, rejecting classes/accessors. */
export function serializeNativeState(state?: unknown): string;
