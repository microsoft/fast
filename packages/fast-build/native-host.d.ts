/// <reference types="node" />

export interface NativeHostOptions {
    markersV2?: boolean;
    dsd?: readonly string[];
    attributeNameStrategy?: "camelCase" | "none";
    maxOutputBytes?: number;
    maxSteps?: number;
}

export interface NativeProgram {
    /** State is strict UTF-8 JSON in an unshared Buffer; output is independently owned. */
    renderEntryJson(state: Buffer): Buffer;
    renderTemplateJson(state: Buffer): Buffer;
    renderHostJson(name: string, state: Buffer): Buffer;
    renderShadowJson(name: string, state: Buffer): Buffer;
}

/**
 * Load the exact-version installed native package for this host, or an explicit local
 * addon path. Never downloads or builds. Artifact Buffers must not use SharedArrayBuffer.
 */
export function loadNativeHost(
    addonPath?: string,
): new (
    artifact: Buffer,
    options?: NativeHostOptions,
) => NativeProgram;
