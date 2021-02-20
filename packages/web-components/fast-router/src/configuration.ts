import { Constructable, html } from "@microsoft/fast-element";
import { NavigationMessage, NavigationQueue, DefaultNavigationQueue } from "./navigation";
import { defaultTransition } from "./transition";
import { RouteCollection, RouteLocationResult, Layout } from "./routes";
import { DefaultLinkHandler, LinkHandler } from "./links";
import {
    DefaultNavigationProcess,
    isNavigationPhaseContributor,
    NavigationContributor,
    NavigationPhaseHook,
    NavigationPhaseName,
    NavigationProcess,
} from "./navigation-process";
import { Router } from "./router";
import { DefaultTitleBuilder, TitleBuilder } from "./titles";

export const defaultLayout = {
    template: html`
        <slot></slot>
    `,
    styles: null,
};

export abstract class RouterConfiguration<TSettings = any> {
    private isConfigured = false;

    protected readonly routes: RouteCollection<TSettings> = new RouteCollection<
        TSettings
    >(this);
    public readonly contributors: NavigationContributor<TSettings>[] = [];
    public defaultLayout: Layout = defaultLayout;
    public defaultTransition = defaultTransition;
    public title = "";

    public createNavigationQueue(): NavigationQueue {
        return this.construct(DefaultNavigationQueue);
    }

    public createLinkHandler(): LinkHandler {
        return this.construct(DefaultLinkHandler);
    }

    public createNavigationProcess(
        router: Router,
        message: NavigationMessage
    ): NavigationProcess {
        return new DefaultNavigationProcess(router, this, message);
    }

    public createTitleBuilder(): TitleBuilder {
        return this.construct(DefaultTitleBuilder);
    }

    public construct<T>(Type: Constructable<T>): T {
        return Reflect.construct(Type, []);
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
