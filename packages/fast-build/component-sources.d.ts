export interface ComponentSource {
    tagName: string;
    template: string;
    stylesheet?: string;
    /** Exact .ts file containing the named class export. */
    clientModule?: string;
    className?: string;
    generated?: string;
}

export interface ComponentSourceOptions {
    /** Absolute directory owning the configuration. */
    baseDir: string;
    operation: "ssr" | "typescript" | "html";
    /** Target-provided output suffix; required only for HTML conversion. */
    templateSuffix?: string;
}

export interface ResolvedComponentSource extends ComponentSource {
    /** Canonical absolute paths for supplied input files. */
    template: string;
    stylesheet?: string;
    clientModule?: string;
    /** Canonical planned output directory for generation; metadata only for SSR. */
    generated?: string;
    templateOutput?: string;
    stylesheetOutput?: string;
    typeSourceImport?: string;
}

export interface ComponentSourceResolution {
    components: ResolvedComponentSource[];
    /** Lexical and canonical input paths, suitable for watching and input protection. */
    inputFiles: string[];
    /** Lexical and canonical generated directories, suitable for feedback exclusion. */
    generatedDirectories: string[];
}

/** Validate record shape without filesystem access or compiler loading. */
export function validateComponentSources(
    components: readonly ComponentSource[],
    operation: ComponentSourceOptions["operation"],
): void;

/** Resolve input files and planned outputs without evaluating modules or writing files. */
export function resolveComponentSources(
    components: readonly ComponentSource[],
    options: ComponentSourceOptions,
): Promise<ComponentSourceResolution>;
