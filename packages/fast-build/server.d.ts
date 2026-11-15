export interface ServerTemplateDefinition {
    content: string;
    shadowrootAttributes?: { name: string; value: string | null }[] | null;
    hostAttributes?: { name: string; value: string | null }[] | null;
    formatVersion?: 1;
}

export type ServerState =
    | null
    | boolean
    | number
    | string
    | ServerState[]
    | { [key: string]: ServerState };

export interface ServerRenderOptions {
    attributeNameStrategy?: "camelCase" | "none";
    markersV2?: boolean;
    /** Omitted renders all registered components; [] renders no shadow roots. */
    dsd?: readonly string[];
}

declare const preparedStateBrand: unique symbol;

/** Opaque immutable snapshot owned by the generated module's runtime instance. */
export interface PreparedServerState {
    readonly [preparedStateBrand]: true;
}

/** Exports of a generated server ESM module. */
export interface ServerModule {
    readonly compilerId: string;
    readonly runtimeVersion: number;
    readonly components: readonly string[];
    /** Copy, validate and normalize once. Dropping the handle allows collection. */
    prepareState(state?: ServerState): PreparedServerState;
    renderEntry(state?: ServerState, options?: ServerRenderOptions): string;
    /** Preserve template-context root host attributes rather than entry-host rules. */
    renderTemplate(state?: ServerState, options?: ServerRenderOptions): string;
    renderHost(name: string, state?: ServerState, options?: ServerRenderOptions): string;
    renderShadow(
        name: string,
        state?: ServerState,
        options?: ServerRenderOptions,
    ): string;
    renderEntryPrepared(
        state: PreparedServerState,
        options?: ServerRenderOptions,
    ): string;
    renderTemplatePrepared(
        state: PreparedServerState,
        options?: ServerRenderOptions,
    ): string;
    renderHostPrepared(
        name: string,
        state: PreparedServerState,
        options?: ServerRenderOptions,
    ): string;
    renderShadowPrepared(
        name: string,
        state: PreparedServerState,
        options?: ServerRenderOptions,
    ): string;
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
