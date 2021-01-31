import { NavigationMessage, NavigationQueue } from "./navigation";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { LinkHandler } from "./links";

export class MainEnlistment {
    private navigationQueue: NavigationQueue | null = null;
    private linkHandler: LinkHandler | null = null;
    private config!: RouterConfiguration;

    public readonly isChild = false;

    constructor(private router: Router) {
        console.log("main enlistment", this);
    }

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
        await this.config.createNavigationProcess(this.router, message).run();

        this.navigationQueue!.receive().then(this.onNavigationMessage);
    };
}

export class ChildEnlistment {
    public readonly isChild = true;

    constructor(
        private readonly parentRouter: Router,
        private readonly childRouter: Router
    ) {
        console.log("child enlistment", this);
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
