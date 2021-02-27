import { NavigationMessage, NavigationQueue } from "./navigation";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { LinkHandler } from "./links";

export class MainEnlistment {
    private navigationQueue: NavigationQueue | null = null;
    private linkHandler: LinkHandler | null = null;
    private config!: RouterConfiguration;

    public readonly isChild = false;
    public readonly level = 0;

    constructor(private router: Router) {}

    public connect(config: RouterConfiguration) {
        this.config = config;

        if (this.navigationQueue !== null) {
            this.navigationQueue.disconnect();
        }

        this.navigationQueue = config.createNavigationQueue();
        this.navigationQueue.connect();
        this.navigationQueue.receive().then(this.onNavigationMessage);

        if (this.linkHandler !== null) {
            this.linkHandler.disconnect();
        }

        this.linkHandler = this.config.createLinkHandler();
        this.linkHandler.connect();
    }

    disconnect() {
        if (this.navigationQueue !== null) {
            this.navigationQueue.disconnect();
            this.navigationQueue = null;
        }

        if (this.linkHandler !== null) {
            this.linkHandler.disconnect();
            this.linkHandler = null;
        }
    }

    private onNavigationMessage = async (message: NavigationMessage) => {
        const process = this.config.createNavigationProcess();
        await process.run(this.router, message);
        this.navigationQueue!.receive().then(this.onNavigationMessage);
    };
}

export class ChildEnlistment {
    public readonly isChild = true;
    public readonly level: number;

    constructor(
        private readonly parentRouter: Router,
        private readonly childRouter: Router
    ) {
        this.level = parentRouter.level + 1;
    }

    connect() {
        this.parentRouter.addContributor(this.childRouter as any);
    }

    disconnect() {
        this.parentRouter.removeContributor(this.childRouter as any);
    }
}

export type NavigationEnlistment = MainEnlistment | ChildEnlistment;

export const NavigationEnlistment = {
    enlist(router: Router) {
        const parentRouter = Router.findParent(router);

        return parentRouter === null
            ? new MainEnlistment(router)
            : new ChildEnlistment(parentRouter, router);
    },
};
