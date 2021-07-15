import { Route } from "./navigation";
/**
 * @alpha
 */
export declare type RouteParameterConverter = (
    value: string | undefined
) => any | Promise<any>;
/**
 * @alpha
 */
export declare class ConfigurableRoute implements Route {
    readonly path: string;
    readonly name: string;
    readonly caseSensitive: boolean;
    constructor(path: string, name: string, caseSensitive: boolean);
}
/**
 * @alpha
 */
export declare class Endpoint<TSettings = any> {
    readonly route: ConfigurableRoute;
    readonly paramNames: readonly string[];
    readonly paramTypes: readonly string[];
    readonly settings: TSettings | null;
    constructor(
        route: ConfigurableRoute,
        paramNames: readonly string[],
        paramTypes: readonly string[],
        settings: TSettings | null
    );
    get path(): string;
}
/**
 * @alpha
 */
export declare class RecognizedRoute<TSettings = any> {
    readonly endpoint: Endpoint<TSettings>;
    readonly params: Readonly<Record<string, string | undefined>>;
    readonly typedParams: Readonly<Record<string, any>>;
    readonly queryParams: Readonly<Record<string, string>>;
    readonly allParams: Readonly<Record<string, string | undefined>>;
    readonly allTypedParams: Readonly<Record<string, any>>;
    constructor(
        endpoint: Endpoint<TSettings>,
        params: Readonly<Record<string, string | undefined>>,
        typedParams: Readonly<Record<string, any>>,
        queryParams: Readonly<Record<string, string>>
    );
    get settings(): TSettings;
}
/**
 * @alpha
 */
export interface RouteRecognizer<TSettings> {
    add(routeOrRoutes: Route | readonly Route[], settings?: TSettings): void;
    recognize(
        path: string,
        converters?: Readonly<Record<string, RouteParameterConverter>>
    ): Promise<RecognizedRoute<TSettings> | null>;
    generateFromName(name: string, params: object): string | null;
    generateFromPath(path: string, params: object): string | null;
}
/**
 * @alpha
 */
export declare class DefaultRouteRecognizer<TSettings>
    implements RouteRecognizer<TSettings> {
    private names;
    private paths;
    private readonly rootState;
    add(routeOrRoutes: Route | readonly Route[], settings?: TSettings): void;
    private $add;
    recognize(
        path: string,
        converters?: Readonly<Record<string, RouteParameterConverter>>
    ): Promise<RecognizedRoute<TSettings> | null>;
    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromName(name: string, params: object): string | null;
    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateFromPath(path: string, params: object): string | null;
    private generate;
}
