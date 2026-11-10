export interface PreparedTemplateDefinition {
    content: string;
    shadowrootAttributes?: { name: string; value: string | null }[] | null;
    hostAttributes?: { name: string; value: string | null }[] | null;
    formatVersion?: 1;
}

export interface PreparedSources {
    /** Provide exactly one of entry and entryFile. */
    entry?: string;
    entryFile?: string;
    templates?: Record<string, string | PreparedTemplateDefinition>;
    /** Files containing named f-template definitions. Duplicate names are rejected. */
    templateFiles?: string[];
}

export interface PreparedRuntimeOptions {
    /** Estimated retained Rust bytes; active requests may temporarily exceed this budget. */
    maxMemoryBytes?: number;
    /** Opt-in development watching. Production should use explicit refresh(). */
    watch?: boolean;
    /** Watch/rebuild failures; defaults to process.emitWarning. */
    onError?: (error: Error) => void;
}

export interface PreparedRenderOptions {
    stream?: boolean;
    markersV2?: boolean;
    attributeNameStrategy?: "camelCase" | "none";
    /** Omitted or "all" renders every registered shadow root; [] disables them all. */
    dsd?: "all" | readonly string[];
}

export type PreparedShadowRootOptions = Omit<PreparedRenderOptions, "stream">;

export interface PreparedArtifactSources {
    entries: Record<string, string>;
    templates?: Record<string, string | PreparedTemplateDefinition>;
}

export interface PreparedManifest {
    version: 2;
    compiler: string;
    generation: string;
    entries: Record<string, string>;
    templates: Record<string, string>;
    pieces: Record<string, { checksum: string; dependencies: string[] }>;
}

export interface PreparedRuntimeConfiguration {
    manifest: PreparedManifest;
    loadArtifact: (id: string) => Promise<Uint8Array>;
    /** Estimated retained Rust bytes, shared across every entry. Defaults to 32 MiB. */
    maxMemoryBytes?: number;
}

export interface PreparedMemoryUsage {
    bytes: number;
    pieces: number;
    pendingLoads: number;
}

/** Identity belongs to one activation, even when generation hashes repeat. */
export interface PreparedSnapshot {
    readonly generation: string;
    /** Resolves after retirement and completion of every accepted reader, including failures. */
    readonly drained: Promise<void>;
}

export interface PreparedArtifacts {
    manifest: PreparedManifest;
    artifacts: Map<string, Uint8Array>;
}

export interface PreparedCompileOptions {
    /**
     * Complete compatible previous result. Invalid manifests, missing/corrupt bytes,
     * or incompatible compiler/format versions reject rather than silently rebuilding.
     * Inputs are still scanned/hashed; unchanged pieces are not compiled again.
     * Previous results are never mutated; reused bytes and descriptors are copied.
     */
    previous?: PreparedArtifacts;
}

/** Synchronously compile a complete registry without filesystem I/O or global caches. */
export function compileArtifacts(
    sources: PreparedArtifactSources,
    options?: PreparedCompileOptions,
): PreparedArtifacts;

/** Storage-independent host. Loading is asynchronous; native execution is synchronous. */
export function createPreparedRuntime(
    options: PreparedRuntimeConfiguration,
): PreparedRuntime;

export class PreparedRuntime {
    private constructor();
    readonly generation: string;
    /** Current immutable activation; retires on successful activation or disposal. */
    readonly snapshot: PreparedSnapshot;
    readonly memoryUsage: PreparedMemoryUsage;
    render(
        entryName: string,
        state: unknown,
        options: PreparedRenderOptions & { stream: true },
    ): Promise<string[]>;
    render(
        entryName: string,
        state?: unknown,
        options?: PreparedRenderOptions & { stream?: false },
    ): Promise<string>;
    render(
        entryName: string,
        state: unknown,
        options: PreparedRenderOptions,
    ): Promise<string | string[]>;
    renderShadowRoot(
        componentName: string,
        state?: unknown,
        options?: PreparedShadowRootOptions,
    ): Promise<string>;
    /** Validate and publish a copied snapshot synchronously, without loading artifacts. */
    activate(manifest: PreparedManifest): string;
    /** Reject new work, drain requests, and release retained pieces. */
    dispose(): Promise<void>;
}

export class PreparedRenderer {
    private constructor();
    readonly directory: string;
    readonly manifestPath: string;
    readonly generation: string;
    readonly memoryUsage: {
        bytes: number;
        pieces: number;
        pendingLoads: number;
    };
    render(
        state: unknown,
        options: PreparedRenderOptions & { stream: true },
    ): Promise<string[]>;
    render(
        state?: unknown,
        options?: PreparedRenderOptions & { stream?: false },
    ): Promise<string>;
    render(state: unknown, options: PreparedRenderOptions): Promise<string | string[]>;
    renderShadowRoot(
        componentName: string,
        state?: unknown,
        options?: PreparedShadowRootOptions,
    ): Promise<string>;
    /** Failed rebuilds reject without activating a replacement snapshot. */
    refresh(changes?: PreparedSources): Promise<string>;
    /** Waits for active requests and releases memory; generated files remain on disk. */
    dispose(): Promise<void>;
}

export function prepareRenderer(
    options: PreparedSources &
        PreparedRuntimeOptions & {
            cacheDirectory: string;
        },
): Promise<PreparedRenderer>;

/** Load generated pieces without reading or recompiling authored template files. */
export function loadRenderer(
    options: PreparedRuntimeOptions & {
        manifestPath: string;
    },
): Promise<PreparedRenderer>;
