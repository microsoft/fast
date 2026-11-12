import type { PreparedTemplateDefinition } from "./prepared.js";

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

/** Exports of a generated server ESM module. */
export interface ServerModule {
    readonly compilerId: string;
    readonly runtimeVersion: number;
    readonly components: readonly string[];
    renderEntry(state?: ServerState, options?: ServerRenderOptions): string;
    renderHost(name: string, state?: ServerState, options?: ServerRenderOptions): string;
    renderShadow(
        name: string,
        state?: ServerState,
        options?: ServerRenderOptions,
    ): string;
}

/** Build-time only. State-independent output; generation eagerly validates all bodies. */
export function compileServerModule(
    entry: string,
    templates?: Record<string, string | PreparedTemplateDefinition>,
    runtimeImport?: string,
): string;
