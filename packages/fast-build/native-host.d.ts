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

/** Explicit local addon path. Artifact Buffers must not be backed by SharedArrayBuffer. */
export function loadNativeHost(
    addonPath: string,
): new (
    artifact: Buffer,
    options?: NativeHostOptions,
) => NativeProgram;
