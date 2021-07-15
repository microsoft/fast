import { RecognizedRoute, RouteParameterConverter } from "./recognizer";
import { NavigationCommand } from "./commands";
import { ViewTemplate, FASTElement, Constructable } from "@microsoft/fast-element";
import { Layout, Transition } from "./view";
import { RouterConfiguration } from "./configuration";
import { Route } from "./navigation";
/**
 * @internal
 */
export declare const childRouteParameter = "fast-child-route";
/**
 * @alpha
 */
export declare type SupportsSettings<TSettings = any> = {
    settings?: TSettings;
};
/**
 * @alpha
 */
export declare type PathedRouteDefinition<TSettings = any> = SupportsSettings<TSettings> &
    Route;
/**
 * @alpha
 */
export declare type IgnorableRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
>;
/**
 * @alpha
 */
export declare type LayoutAndTransitionRouteDefinition = {
    layout?: Layout | ViewTemplate;
    transition?: Transition;
};
/**
 * @alpha
 */
export declare type RedirectRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> & {
    redirect: string;
};
/**
 * @alpha
 */
export declare type HasTitle = {
    title?: string;
};
/**
 * @alpha
 */
export declare type NavigableRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> &
    LayoutAndTransitionRouteDefinition &
    HasTitle & {
        childRouters?: boolean;
    };
/**
 * @alpha
 */
export declare type FASTElementConstructor = new () => FASTElement;
/**
 * @alpha
 */
export declare type HasElement = {
    element:
        | string
        | FASTElementConstructor
        | HTMLElement
        | (() => Promise<string | FASTElementConstructor | HTMLElement>);
};
/**
 * @alpha
 */
export declare type ElementFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition &
    HasElement &
    SupportsSettings<TSettings> &
    HasTitle;
/**
 * @alpha
 */
export declare type ElementRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasElement;
/**
 * @alpha
 */
export declare type HasTemplate = {
    template: ViewTemplate | (() => Promise<ViewTemplate>);
};
/**
 * @alpha
 */
export declare type TemplateFallbackRouteDefinition<
    TSettings = any
> = LayoutAndTransitionRouteDefinition &
    HasTemplate &
    SupportsSettings<TSettings> &
    HasTitle;
/**
 * @alpha
 */
export declare type TemplateRouteDefinition<TSettings = any> = NavigableRouteDefinition<
    TSettings
> &
    HasTemplate;
/**
 * @alpha
 */
export declare type HasCommand = {
    command: NavigationCommand;
};
/**
 * @alpha
 */
export declare type CommandRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> &
    HasCommand &
    HasTitle;
/**
 * @alpha
 */
export declare type CommandFallbackRouteDefinition<TSettings = any> = HasCommand &
    SupportsSettings<TSettings> &
    HasTitle;
/**
 * @alpha
 */
export declare type FallbackRouteDefinition<TSettings = any> =
    | ElementFallbackRouteDefinition<TSettings>
    | TemplateFallbackRouteDefinition<TSettings>
    | Pick<RedirectRouteDefinition<TSettings>, "redirect">
    | CommandFallbackRouteDefinition<TSettings>;
/**
 * @alpha
 */
export declare type DefinitionCallback = () =>
    | Promise<FallbackRouteDefinition>
    | FallbackRouteDefinition;
/**
 * @alpha
 */
export declare type RenderableRouteDefinition<TSettings = any> =
    | ElementRouteDefinition<TSettings>
    | TemplateRouteDefinition<TSettings>;
/**
 * @alpha
 */
export declare type MappableRouteDefinition<TSettings = any> =
    | RenderableRouteDefinition<TSettings>
    | RedirectRouteDefinition<TSettings>
    | CommandRouteDefinition<TSettings>
    | ParentRouteDefinition<TSettings>;
/**
 * @alpha
 */
export declare type ParentRouteDefinition<TSettings = any> = PathedRouteDefinition<
    TSettings
> &
    LayoutAndTransitionRouteDefinition & {
        children: MappableRouteDefinition<TSettings>[];
    };
/**
 * @alpha
 */
export declare type RouteMatch<TSettings = any> = {
    route: RecognizedRoute<TSettings>;
    command: NavigationCommand;
};
/**
 * @alpha
 */
export declare type ConverterObject = {
    convert: RouteParameterConverter;
};
/**
 * @alpha
 */
export declare type ParameterConverter =
    | RouteParameterConverter
    | ConverterObject
    | Constructable<ConverterObject>;
/**
 * @alpha
 */
export declare class RouteCollection<TSettings = any> {
    private owner;
    private _recognizer;
    private pathToCommand;
    private fallbackCommand;
    private fallbackSettings;
    private converters;
    constructor(owner: RouterConfiguration);
    private get recognizer();
    ignore(definitionOrString: IgnorableRouteDefinition<TSettings> | string): void;
    map(...routes: MappableRouteDefinition<TSettings>[]): void;
    fallback(
        definitionOrCallback: FallbackRouteDefinition<TSettings> | DefinitionCallback
    ): void;
    converter(name: string, converter: ParameterConverter): void;
    recognize(path: string): Promise<RouteMatch<TSettings> | null>;
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
    private aggregateConverters;
}
