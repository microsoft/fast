export interface ServerTemplateDefinition {
    content: string;
    shadowrootAttributes?: { name: string; value: string | null }[] | null;
    hostAttributes?: { name: string; value: string | null }[] | null;
    formatVersion?: 1;
}

export interface ServerRenderOptions {
    attributeNameStrategy?: "camelCase" | "none";
    markersV2?: boolean;
    /** Omitted renders all registered components; [] renders no shadow roots. */
    dsd?: readonly string[];
}

/** Exports of a generated server ESM module. */
export interface ServerModule {
    readonly compilerId: string;
    readonly runtimeVersion: number;
    readonly components: readonly string[];
    /** Parse fresh JSON internally and validate every value without snapshot copying. */
    renderEntryJson(json: string, options?: ServerRenderOptions): string;
    renderTemplateJson(json: string, options?: ServerRenderOptions): string;
    renderHostJson(name: string, json: string, options?: ServerRenderOptions): string;
    renderShadowJson(name: string, json: string, options?: ServerRenderOptions): string;
}

/** Build-time only. State-independent output; generation eagerly validates all bodies. */
export function compileServerModule(
    entry: string,
    templates?: Record<string, string | ServerTemplateDefinition>,
    runtimeImport?: string,
): string;

/** Build-time only. Load with the exact compiler-matching native Rust library. */
export function compileServerArtifact(
    entry: string,
    templates?: Record<string, string | ServerTemplateDefinition>,
): Uint8Array;
