import { Constructable, FASTElement, HTMLView } from "@microsoft/fast-element";
import { composedParent } from "@microsoft/fast-foundation";
import { RenderCommand } from "./commands";
import { RouterConfiguration } from "./configuration";
import { NavigationContributor, RouterExecutionContext } from "./contributors";
import { Layout } from "./layout";
import { LinkHandler } from "./links";
import { NavigationMessage, NavigationQueue } from "./navigation";
import { NavigationPhase } from "./phases";
import { RecognizedRoute } from "./recognizer";
import { childRouteParameter } from "./routes";
import { Transition } from "./transition";

export interface RenderOperation {
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

export interface Router<TSettings = any> {
    readonly level: number;
    readonly parent: Router | null;
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
            return parent[routerProperty];
        }
    }

    return null;
}

export interface RouterElement extends HTMLElement {
    readonly [routerProperty]: Router;
    config: RouterConfiguration | null;
    connectedCallback();
    disconnectedCallback();
}

export const Router = Object.freeze({
    getOrCreateFor(element: HTMLElement) {
        const router: Router = element[routerProperty];

        if (router !== void 0) {
            return router;
        }

        return (element[routerProperty] = new DefaultRouter(element));
    },

    find(element: HTMLElement): Router | null {
        return element[routerProperty] || findParentRouterForElement(element);
    },

    from<TBase extends typeof HTMLElement>(
        Type: TBase
    ): TBase & Constructable<RouterElement> {
        class RouterBase extends (Type as any) {
            public readonly [routerProperty]!: Router;

            public get config(): RouterConfiguration {
                return this[routerProperty].config!;
            }

            public set config(value: RouterConfiguration) {
                this[routerProperty].config = value;
            }

            constructor() {
                super();
                Router.getOrCreateFor(this as any);
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

function isFASTElementHost(host: HTMLElement): host is HTMLElement & FASTElement {
    return host instanceof FASTElement;
}

export class DefaultRouter implements Router {
    private parentRouter: Router | null | undefined = void 0;
    private contributors = new Set<NavigationContributor>();

    private navigationQueue: NavigationQueue | null = null;
    private linkHandler: LinkHandler | null = null;

    private newView: HTMLView | null = null;
    private newRoute: RecognizedRoute | null = null;

    private childCommandContributor: NavigationContributor | null = null;
    private childRoute: RecognizedRoute | null = null;
    private isConnected = false;

    private routerConfig: RouterConfiguration | null = null;
    private view: HTMLView | null = null;
    private route: RecognizedRoute | null = null;

    public constructor(public readonly host: HTMLElement) {
        host[routerProperty] = this;
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

        return this.parentRouter || null;
    }

    public get level() {
        if (this.parent === null) {
            return 0;
        }

        return this.parent.level + 1;
    }

    public shouldRender(route: RecognizedRoute): boolean {
        if (this.route && this.route.endpoint.path === route.endpoint.path) {
            const newParams = route?.params;
            const oldParams = this.route?.params;

            if (JSON.stringify(oldParams) === JSON.stringify(newParams)) {
                return false;
            }
        }

        return true;
    }

    public async beginRender(route: RecognizedRoute, command: RenderCommand) {
        this.newRoute = route;
        this.newView = await command.createView();

        this.newView.bind(route.typedParams, RouterExecutionContext.create(this));

        this.newView.appendTo(this.host);

        return {
            commit: this.renderOperationCommit.bind(
                this,
                command.layout,
                command.transition
            ),
            rollback: this.renderOperationRollback.bind(this),
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
        const router = this.host;

        if (isFASTElementHost(router)) {
            if (router.$fastController.template !== layout.template) {
                router.$fastController.template = layout.template!;
            }

            if (router.$fastController.styles !== layout.styles) {
                router.$fastController.styles = layout.styles!;
            }
        }

        await transition(this.host, this.view, this.newView!);

        if (this.view !== null) {
            this.view.dispose();
        }

        this.route = this.newRoute;
        this.view = this.newView;

        this.newRoute = null;
        this.newView = null;
    }

    private async renderOperationRollback() {
        if (this.newView !== null) {
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
            const rest = phase.route.params[childRouteParameter] || "";
            const result = await this.config!.findRoute(rest);

            if (result === null) {
                phase.cancel();
                return;
            }

            this.childRoute = result.route;
            this.childCommandContributor = await result.command.createContributor(
                this,
                result.route
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
