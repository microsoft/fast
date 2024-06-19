import { Constructable } from "@microsoft/fast-element";
import { DefaultNavigationQueue, NavigationQueue } from "./navigation.js";
import { Layout, Transition } from "./view.js";
import { RouteCollection, RouteMatch } from "./routes.js";
import { DefaultLinkHandler, LinkHandler } from "./links.js";
import { DefaultNavigationProcess, NavigationProcess } from "./process.js";
import { DefaultTitleBuilder, TitleBuilder } from "./titles.js";
import { DefaultRoutingEventSink, RoutingEventSink } from "./events.js";
import { isNavigationPhaseContributor, NavigationContributor } from "./contributors.js";
import { NavigationPhaseHook, NavigationPhaseName } from "./phases.js";
import { DefaultRouteRecognizer, RouteRecognizer } from "./recognizer.js";

/**
 * @beta
 */
export abstract class RouterConfiguration<TSettings = any> {
    private isConfigured = false;

    public readonly routes: RouteCollection<TSettings> = new RouteCollection<TSettings>(
        this
    );
    public readonly contributors: NavigationContributor<TSettings>[] = [];
    public defaultLayout: Layout = Layout.default;
    public defaultTransition = Transition.default;
    public title = "";
    public parent: RouterConfiguration<TSettings> | null = null;

    public createNavigationQueue(): NavigationQueue {
        return this.construct(DefaultNavigationQueue);
    }

    public createLinkHandler(): LinkHandler {
        return this.construct(DefaultLinkHandler);
    }

    public createNavigationProcess(): NavigationProcess {
        return new DefaultNavigationProcess();
    }

    public createEventSink(): RoutingEventSink {
        return this.construct(DefaultRoutingEventSink);
    }

    public createTitleBuilder(): TitleBuilder {
        return this.construct(DefaultTitleBuilder);
    }

    public createRouteRecognizer(): RouteRecognizer<TSettings> {
        return this.construct<DefaultRouteRecognizer<TSettings>>(DefaultRouteRecognizer);
    }

    public construct<T>(Type: Constructable<T>): T {
        if (this.parent !== null) {
            return this.parent.construct(Type);
        }

        return new Type();
    }

    public async recognizeRoute(path: string): Promise<RouteMatch<TSettings> | null> {
        await this.ensureConfigured();
        return this.routes.recognize(path);
    }

    /**
     * Generate a path and query string from a route name and params object.
     *
     * @param name - The name of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    public async generateRouteFromName(
        name: string,
        params: object
    ): Promise<string | null> {
        await this.ensureConfigured();
        return this.routes.generateFromName(name, params);
    }

    /**
     * Generate a path and query string from a route path and params object.
     *
     * @param path - The path of the route to generate from.
     * @param params - The route params to use when populating the pattern.
     * Properties not required by the pattern will be appended to the query string.
     * @returns The generated absolute path and query string.
     */
    public async generateRouteFromPath(
        path: string,
        params: object
    ): Promise<string | null> {
        await this.ensureConfigured();
        return this.routes.generateFromPath(path, params);
    }

    public findContributors<T extends NavigationPhaseName>(
        phase: T
    ): Record<T, NavigationPhaseHook<TSettings>>[] {
        return this.contributors.filter(x =>
            isNavigationPhaseContributor(x, phase)
        ) as any;
    }

    protected abstract configure(): Promise<void> | void;

    protected cached(ElementType: new () => HTMLElement) {
        let instance: HTMLElement | null = null;
        return async () => {
            if (instance === null) {
                instance = new ElementType();
            }

            return instance as any as HTMLElement;
        };
    }

    private async ensureConfigured() {
        if (!this.isConfigured) {
            await this.configure();
            this.isConfigured = true;
        }
    }
}
