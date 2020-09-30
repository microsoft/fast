import { NavigationMessage, NavigationQueue } from "./navigation";
import { NavigationTransaction } from "./transaction";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { LinkHandler } from "./links";

export class MainEnlistment {
    private navigationQueue: NavigationQueue | null = null;
    private linkHandler: LinkHandler | null = null;
    private config!: RouterConfiguration;
    public readonly managesNavigation = true;

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

    private onNavigationMessage = async (message: NavigationMessage) => {
        const result = await this.config.findRoute(message.path);

        if (result !== null) {
            const transaction = new NavigationTransaction(
                this.router,
                this.config,
                result.route,
                result.command
            );

            await transaction.run();
        }

        this.navigationQueue!.receive().then(this.onNavigationMessage);
    };
}

export class ChildEnlistment {
    public readonly managesNavigation = false;

    constructor(
        private readonly parentRouter: Router,
        private readonly childRouter: Router
    ) {
        console.log("child enlistment", this);
        parentRouter.addNavigationParticipant(childRouter);
    }
}

export type NavigationEnlistment = MainEnlistment | ChildEnlistment;

export const NavigationEnlistment = {
    enlist(router: Router) {
        const parentRouter = findParentRouter(router);

        return parentRouter === null
            ? new MainEnlistment(router)
            : new ChildEnlistment(parentRouter, router);
    },
};

export function findParentRouter(element: HTMLElement): Router | null {
    let parentNode: HTMLElement | null = element;

    while ((parentNode = composedParent(parentNode))) {
        if (parentNode.tagName === "FAST-ROUTER") {
            return parentNode as Router;
        }
    }

    return null;
}

function composedParent<T extends HTMLElement>(element: T): HTMLElement | null {
    const parentNode = element.parentElement;

    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();

        if ((rootNode as ShadowRoot).host instanceof HTMLElement) {
            // this is shadow-root
            return (rootNode as ShadowRoot).host as HTMLElement;
        }
    }

    return null;
}
