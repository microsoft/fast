import { html } from "@microsoft/fast-element";
import { NavigationQueue, PopStateNavigationQueue } from "./navigation";
import { defaultTransition } from "./transition";
import { NavigationContributor } from "./contributions";
import {
    RouteCollection,
    RouteLocationResult,
    Layout,
    FASTElementConstructor,
} from "./routes";
import { DefaultLinkHandler, LinkHandler } from "./links";

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

    public createNavigationQueue(): NavigationQueue {
        return new PopStateNavigationQueue();
    }

    public createLinkHandler(): LinkHandler {
        return new DefaultLinkHandler();
    }

    public async findRoute(path: string): Promise<RouteLocationResult<TSettings> | null> {
        if (!this.isConfigured) {
            await this.configure();
            this.isConfigured = true;
        }

        return this.routes.find(path);
    }

    protected abstract configure(): Promise<void>;

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
