import { Constructable } from "@microsoft/fast-element";
import { NavigationQueue } from "./navigation";
import { Layout, Transition } from "./view";
import { RouteCollection, RouteMatch } from "./routes";
import { LinkHandler } from "./links";
import { NavigationProcess } from "./process";
import { TitleBuilder } from "./titles";
import { RoutingEventSink } from "./events";
import { NavigationContributor } from "./contributors";
import { NavigationPhaseHook, NavigationPhaseName } from "./phases";
import { RouteRecognizer } from "./recognizer";
/**
 * @alpha
 */
export declare abstract class RouterConfiguration<TSettings = any> {
    private isConfigured;
    readonly routes: RouteCollection<TSettings>;
    readonly contributors: NavigationContributor<TSettings>[];
    defaultLayout: Layout;
    defaultTransition: Readonly<Transition>;
    title: string;
    parent: RouterConfiguration<TSettings> | null;
    createNavigationQueue(): NavigationQueue;
    createLinkHandler(): LinkHandler;
    createNavigationProcess(): NavigationProcess;
    createEventSink(): RoutingEventSink;
    createTitleBuilder(): TitleBuilder;
    createRouteRecognizer(): RouteRecognizer<TSettings>;
    construct<T>(Type: Constructable<T>): T;
    recognizeRoute(path: string): Promise<RouteMatch<TSettings> | null>;
    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateRouteFromName(name: string, params: object): Promise<string | null>;
    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    generateRouteFromPath(path: string, params: object): Promise<string | null>;
    findContributors<T extends NavigationPhaseName>(
        phase: T
    ): Record<T, NavigationPhaseHook<TSettings>>[];
    protected abstract configure(): Promise<void> | void;
    protected cached(ElementType: new () => HTMLElement): () => Promise<HTMLElement>;
    private ensureConfigured;
}
