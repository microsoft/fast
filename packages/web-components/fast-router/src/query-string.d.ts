/**
 * @alpha
 */
export declare const QueryString: Readonly<{
    readonly current: string;
    /**
     * Generate a query string from an object.
     *
     * @param params - Object containing the keys and values to be used.
     * @param traditional - Boolean Use the old URI template standard (RFC6570)
     * @returns The generated query string, excluding leading '?'.
     */
    build(params: Object, traditional?: boolean): string;
    /**
     * Separate the query string from the path and returns the two parts.
     * @param path - The path to separate.
     */
    separate(
        path: string
    ): Readonly<{
        path: string;
        queryString: string;
    }>;
    /**
     * Parse a query string.
     *
     * @param queryString - The query string to parse.
     * @returns Object with keys and values mapped from the query string.
     */
    parse(queryString: string): Readonly<Record<string, string>>;
}>;
