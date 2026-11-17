export interface ServerTemplateDefinition {
    content: string;
    shadowrootAttributes?: { name: string; value: string | null }[] | null;
    hostAttributes?: { name: string; value: string | null }[] | null;
    formatVersion?: 1;
}

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
          /** Raw sources must contain at least one named template with unique names. */
          templateSources: readonly string[];
          templates?: never;
      };

export interface ServerAssetWriteOptions {
    /** Existing changed or unmanaged output requires explicit permission to replace. */
    overwrite?: boolean;
    /** Return owned output bytes captured under the writer lock, without reopening the path. */
    includeBytes?: boolean;
    /** Nameless-template diagnostics, emitted only when raw sources are parsed. */
    onWarning?: (warning: { sourceIndex: number; content: string }) => void;
}

export interface ServerAssetWriteResult {
    /** Includes exact-byte restoration when an unchanged managed output is missing. */
    reused: boolean;
    manifestPath: string;
    /** Present only with includeBytes; independent of subsequent output-file changes. */
    bytes?: Uint8Array;
}

/** Persist native bytes and an exact authored-input/output-byte sidecar. */
export function writeServerArtifact(
    outputPath: string,
    inputs: ServerAssetInputs,
    options?: ServerAssetWriteOptions,
): ServerAssetWriteResult;
