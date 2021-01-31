import {
    customElement,
    FASTElement,
    HTMLView,
    observable,
} from "@microsoft/fast-element";
import { NavigationEnlistment } from "./enlistment";
import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";
import { childRouteParameter, RouteLocationResult } from "./routes";
import { NavigationContributor, NavigationPhase } from "./navigation-process";

@customElement("fast-router")
export class FASTRouter extends FASTElement implements Router {
    private enlistment: NavigationEnlistment | null = null;
    private contributors = new Set<NavigationContributor>();

    @observable public config: RouterConfiguration | null = null;
    @observable public readonly view: HTMLView | null = null;
    @observable public readonly command: NavigationCommand | null = null;
    @observable public readonly route: RecognizedRoute | null = null;

    configChanged() {
        this.tryConnectEnlistment();
    }

    connectedCallback() {
        super.connectedCallback();
        this.enlistment = NavigationEnlistment.enlist(this);
        this.tryConnectEnlistment();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this.enlistment !== null) {
            this.enlistment.disconnect();
            this.enlistment = null;
        }
    }

    tryConnectEnlistment() {
        if (this.config !== null && this.enlistment !== null) {
            this.enlistment.connect(this.config);
        }
    }

    addContributor(contributor: NavigationContributor): void {
        this.contributors.add(contributor);
        console.log("add contributor to router", contributor);
    }

    removeContributor(contributor: NavigationContributor): void {
        this.contributors.delete(contributor);
        console.log("remove contributor from router", contributor);
    }

    findRoute<TSettings = any>(
        path: string
    ): Promise<RouteLocationResult<TSettings> | null> {
        return this.config!.findRoute(path);
    }

    private childCommandContributor: NavigationContributor | null = null;
    private childRoute: RecognizedRoute | null = null;

    async navigate(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    async leave(phase: NavigationPhase) {
        await this.tunnel(phase);

        if (!phase.canceled) {
            const contributors = this.contributors;
            this.contributors = new Set();
            phase.onCancel(() => (this.contributors = contributors));
        }
    }

    async construct(phase: NavigationPhase) {
        if (this.enlistment!.isChild) {
            const rest = phase.route.params[childRouteParameter] || "";
            const result = await this.findRoute(rest);

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

    async enter(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    async commit(phase: NavigationPhase) {
        await this.tunnel(phase);
    }

    private async tunnel(phase: NavigationPhase) {
        const route = this.childRoute;
        const contributor = this.childCommandContributor;

        if (route && contributor) {
            await phase.evaluateContributor(contributor, route);
        }

        if (phase.canceled) {
            return;
        }

        const potentialContributors = [
            ...this.config!.findContributors(phase.name),
            ...Array.from(this.contributors),
        ];

        for (const potential of potentialContributors) {
            await phase.evaluateContributor(potential);

            if (phase.canceled) {
                return;
            }
        }
    }
}
