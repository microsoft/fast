import { Constructable } from "@microsoft/fast-element";
import { NavigationQueue, DefaultNavigationQueue } from "./navigation";
import { Transition } from "./transition";
import { RouteCollection, RouteLocationResult } from "./routes";
import { DefaultLinkHandler, LinkHandler } from "./links";
import { DefaultNavigationProcess, NavigationProcess } from "./process";
import { DefaultTitleBuilder, TitleBuilder } from "./titles";
import { DefaultRoutingEventSink, RoutingEventSink } from "./events";
import { isNavigationPhaseContributor, NavigationContributor } from "./contributors";
import { NavigationPhaseHook, NavigationPhaseName } from "./phases";
import { Layout } from "./layout";

export abstract class RouterConfiguration<TSettings = any> {
    private isConfigured = false;

    protected readonly routes: RouteCollection<TSettings> = new RouteCollection<
        TSettings
    >(this);
    public readonly contributors: NavigationContributor<TSettings>[] = [];
    public defaultLayout: Layout = Layout.default;
    public defaultTransition = Transition.default;
    public title = "";

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

    public construct<T>(Type: Constructable<T>): T {
        return new Type();
    }

    public async findRoute(path: string): Promise<RouteLocationResult<TSettings> | null> {
        if (!this.isConfigured) {
            await this.configure();
            this.isConfigured = true;
        }

        return this.routes.find(path);
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

            return (instance as any) as HTMLElement;
        };
    }
}
