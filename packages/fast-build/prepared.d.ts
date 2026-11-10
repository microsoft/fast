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
