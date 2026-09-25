import { FASTElement } from "@microsoft/fast-element";
import { composedParent } from "@microsoft/fast-element/utilities.js";
import { RenderCommand } from "./commands.js";
import { RouterConfiguration } from "./configuration.js";
import { NavigationContributor } from "./contributors.js";
import { LinkHandler } from "./links.js";
import { NavigationMessage, NavigationQueue } from "./navigation.js";
import { NavigationPhase } from "./phases.js";
import { RecognizedRoute } from "./recognizer.js";
import { childRouteParameter } from "./routes.js";
import { Layout, RouteView, Transition } from "./view.js";

/**
 * @beta
 */
export interface RenderOperation {
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

/**
 * @beta
 */
export interface Router<TSettings = any> {
    readonly level: number;
    readonly parent: Router | null;
    readonly route: RecognizedRoute | null;
    config: RouterConfiguration | null;

    connect(): void;
    disconnect(): void;

    shouldRender(route: RecognizedRoute<TSettings>): boolean;
    beginRender(
        route: RecognizedRoute<TSettings>,
        command: RenderCommand
    ): Promise<RenderOperation>;

    addContributor(contributor: NavigationContributor): void;
    removeContributor(contributor: NavigationContributor): void;
}

const routerProperty = "$router";

function findParentRouterForElement(element: HTMLElement) {
    let parent: HTMLElement | null = element;

    while ((parent = composedParent(parent))) {
        if (routerProperty in parent) {
            return parent[routerProperty] as Router;
        }
    }

    return null;
}

/**
 * @beta
 */
export interface RouterElement extends HTMLElement {
    readonly [routerProperty]: Router;
    config: RouterConfiguration | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
}

/**
 * @beta
 */
export const Router = Object.freeze({
    getOrCreateFor(element: HTMLElement) {
        const router: Router = (element as any)[routerProperty];

        if (router !== void 0) {
            return router;
        }

        return ((element as any)[routerProperty] = new DefaultRouter(element));
    },

    find(element: HTMLElement): Router | null {
        return (element as any)[routerProperty] || findParentRouterForElement(element);
    },

    from<TBase extends typeof HTMLElement>(
        BaseType: TBase
    ): { new (): InstanceType<TBase> & RouterElement } {
        class RouterBase extends (BaseType as any) {
            public readonly [routerProperty]!: Router;
            declare config: RouterConfiguration | null;

            constructor() {
                super();

                const router = Router.getOrCreateFor(this as any);
                const config = this.config || null;

                delete (this as any).config;

                Reflect.defineProperty(this, "config", {
                    get() {
                        return router.config;
                    },
                    set(value) {
                        router.config = value;
                    },
                });

                if (config !== null) {
                    router.config = config;
                }
            }
        }

        const proto = RouterBase.prototype;

        if ("connectedCallback" in proto) {
            const original = proto.connectedCallback;
            proto.connectedCallback = function () {
                original.call(this);
                this[routerProperty].connect();
            };
        } else {
            proto.connectedCallback = function () {
                this[routerProperty].connect();
            };
        }

        if ("disconnectedCallback" in proto) {
            const original = proto.disconnectedCallback;
            proto.disconnectedCallback = function () {
                original.call(this);
                this[routerProperty].disconnect();
            };
        } else {
            proto.disconnectedCallback = function () {
                this[routerProperty].disconnect();
            };
        }

        return RouterBase as any;
    },
});

/**
 * @beta
 */
export function isFASTElementHost(host: HTMLElement): host is HTMLElement & FASTElement {
    return host instanceof FASTElement;
}

/**
 * @beta
 */
export class DefaultRouter implements Router {
    private parentRouter: Router | null | undefined = void 0;
    private contributors = new Set<NavigationContributor>();

    private navigationQueue: NavigationQueue | null = null;
    private linkHandler: LinkHandler | null = null;

    private newView: RouteView | null = null;
    private newRoute: RecognizedRoute | null = null;

    private childCommandContributor: NavigationContributor | null = null;
    private childRoute: RecognizedRoute | null = null;
    private isConnected = false;

    private routerConfig: RouterConfiguration | null = null;
    private view: RouteView | null = null;

    public route: RecognizedRoute | null = null;

    public constructor(public readonly host: HTMLElement) {
        (host as any)[routerProperty] = this;
    }

    public get config(): RouterConfiguration | null {
        return this.routerConfig;
    }

    public set config(value: RouterConfiguration | null) {
        this.routerConfig = value;
        this.tryConnect();
    }

    public get parent() {
        if (this.parentRouter === void 0) {
            if (!this.isConnected) {
                return null;
            }

            this.parentRouter = findParentRouterForElement(this.host);
        }

        return this.parentRouter;
    }

    public get level() {
        if (this.parent === null) {
            return 0;
        }

        return this.parent.level + 1;
    }

    public shouldRender(route: RecognizedRoute): boolean {
        if (this.route && this.route.endpoint.path === route.endpoint.path) {
            const newParams = route?.allParams;
            const oldParams = this.route?.allParams;

            if (JSON.stringify(oldParams) === JSON.stringify(newParams)) {
                return false;
            }
        }

        return true;
    }

    public async beginRender(route: RecognizedRoute, command: RenderCommand) {
        this.newRoute = route;
        this.newView = await command.createView();
        this.newView.context.router = this;
        this.newView.bind(route.allTypedParams);
        this.newView.appendTo(this.host);

        await command.transition.begin(this.host, this.view, this.newView);

        return {
            commit: this.renderOperationCommit.bind(
                this,
                command.layout,
                command.transition
            ),
            rollback: this.renderOperationRollback.bind(this, command.transition),
        };
    }

    public connect() {
        this.isConnected = true;
        this.tryConnect();
    }

    public disconnect() {
        if (this.parent === null) {
            if (this.navigationQueue !== null) {
                this.navigationQueue.disconnect();
                this.navigationQueue = null;
            }

            if (this.linkHandler !== null) {
                this.linkHandler.disconnect();
                this.linkHandler = null;
            }
        } else {
            this.parent!.removeContributor(this as any);
        }

        this.isConnected = false;
        this.parentRouter = void 0;
    }

    public addContributor(contributor: NavigationContributor): void {
        this.contributors.add(contributor);
    }

    public removeContributor(contributor: NavigationContributor): void {
        this.contributors.delete(contributor);
    }

    private tryConnect() {
        if (this.config === null || !this.isConnected) {
            return;
        }

        if (this.parent === null) {
            if (this.navigationQueue !== null) {
                this.navigationQueue.disconnect();
            }

            this.navigationQueue = this.config!.createNavigationQueue();
            this.navigationQueue.connect();
            this.navigationQueue.receive().then(this.onNavigationMessage);

            if (this.linkHandler !== null) {
                this.linkHandler.disconnect();
            }

            this.linkHandler = this.config!.createLinkHandler();
            this.linkHandler.connect();
        } else {
            this.config.parent = this.parent.config;
            this.parent!.addContributor(this as any);
        }
    }

    private onNavigationMessage = async (message: NavigationMessage) => {
        const process = this.config!.createNavigationProcess();
        await process.run(this, message);
        this.navigationQueue!.receive().then(this.onNavigationMessage);
    };

    private async renderOperationCommit(layout: Layout, transition: Transition) {
        await layout.beforeCommit(this.host);
        await transition.commit(this.host, this.view, this.newView!);
        await layout.afterCommit(this.host);

        if (this.view !== null) {
            this.view.dispose();
        }

        this.route = this.newRoute;
        this.view = this.newView;

        this.newRoute = null;
        this.newView = null;
    }

    private async renderOperationRollback(transition: Transition) {
        if (this.newView !== null) {
            await transition.rollback(this.host, this.view, this.newView);
            this.newView.dispose();
            this.newRoute = null;
            this.newView = null;
        }
    }

    private async navigate(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    private async leave(phase: NavigationPhase) {
        await this.tunnel(phase);

        if (!phase.canceled) {
            const contributors = this.contributors;
            this.contributors = new Set();
            phase.onCancel(() => (this.contributors = contributors));
        }
    }

    private async construct(phase: NavigationPhase) {
        if (this.parent !== null) {
            const rest = phase.route.allParams[childRouteParameter] || "";
            const match = await this.config!.recognizeRoute(rest);

            if (match === null) {
                const events = this.config!.createEventSink();
                events.onUnhandledNavigationMessage(this, new NavigationMessage(rest));
                phase.cancel();
                return;
            }

            this.childRoute = match.route;
            this.childCommandContributor = await match.command.createContributor(
                this,
                match.route
            );
        }

        await this.tunnel(phase);
    }

    private async enter(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    private async commit(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    private async tunnel(phase: NavigationPhase) {
        const route = this.childRoute;
        const contributor = this.childCommandContributor;

        if (route && contributor) {
            await phase.evaluateContributor(contributor, route, this);
        }

        if (phase.canceled) {
            return;
        }

        const potentialContributors = [
            ...this.config!.findContributors(phase.name),
            ...Array.from(this.contributors),
        ];

        for (const potential of potentialContributors) {
            await phase.evaluateContributor(potential, void 0, this);

            if (phase.canceled) {
                return;
            }
        }
    }
}
