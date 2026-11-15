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

/** Complete source-only ESM deployment. Relative names never contain path separators. */
export interface ServerAssets {
    entry: string;
    files: Record<string, string>;
}

/** Same schema/executor as compileServerModule, with separately numbered plan modules. */
export function compileServerAssets(
    entry: string,
    templates?: Record<string, string | ServerTemplateDefinition>,
    runtimeImport?: string,
): ServerAssets;

/** Build-time only. Load with a native library supporting the emitted artifact schema. */
export function compileServerArtifact(
    entry: string,
    templates?: Record<string, string | ServerTemplateDefinition>,
): Uint8Array;

/** Authored inputs only; raw sources are parsed by Rust on a persistent cache miss. */
export type ServerAssetInputs =
    | {
          entry: string;
          templates?: Record<string, string | ServerTemplateDefinition>;
          templateSources?: never;
      }
    | {
          entry: string;
          templateSources: readonly string[];
          templates?: never;
      };

export interface ServerAssetWriteOptions {
    /** Existing changed or unmanaged output requires explicit permission to replace. */
    overwrite?: boolean;
    /** Nameless-template diagnostics, emitted only when raw sources are parsed. */
    onWarning?: (warning: { sourceIndex: number; content: string }) => void;
}

export interface ServerModuleWriteOptions extends ServerAssetWriteOptions {
    /** Persisted deployment configuration; cannot change for a managed asset. */
    runtimeImport?: string;
}

export interface ServerAssetWriteResult {
    /** Includes exact-byte restoration when an unchanged managed output is missing. */
    reused: boolean;
    manifestPath: string;
}

export interface ServerAssetsWriteOptions {
    runtimeImport?: string;
    onWarning?: (warning: { sourceIndex: number; content: string }) => void;
}

/**
 * Publish a complete immutable directory by one rename. Exact inputs reuse every
 * recorded byte before loading WASM. Changed inputs/configuration require a new
 * destination; incomplete or modified deployments are never repaired in place.
 */
export function writeServerAssets(
    outputDirectory: string,
    inputs: ServerAssetInputs,
    options?: ServerAssetsWriteOptions,
): ServerAssetWriteResult;

/**
 * Synchronously persist server ESM and an exact authored-input/output-byte sidecar.
 * Unchanged managed output is reused before loading the compiler. Corruption and
 * deployment changes fail closed even when overwrite is enabled.
 */
export function writeServerModule(
    outputPath: string,
    inputs: ServerAssetInputs,
    options?: ServerModuleWriteOptions,
): ServerAssetWriteResult;

/** Native counterpart of writeServerModule; no runtime import configuration. */
export function writeServerArtifact(
    outputPath: string,
    inputs: ServerAssetInputs,
    options?: ServerAssetWriteOptions,
): ServerAssetWriteResult;
