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
import { RouteLocationResult } from "./routes";
import {
    isNavigationPhaseContributor,
    NavigationContributor,
    NavigationPhase,
    NavigationPhaseHook,
    NavigationPhaseName,
    NavigationPhaseResult,
} from "./navigation-process";

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

    findContributors<T extends NavigationPhaseName>(
        phase: T
    ): Record<T, NavigationPhaseHook>[] {
        return this.config!.findContributors(phase).concat(
            Array.from(this.contributors).filter(x =>
                isNavigationPhaseContributor(x, phase)
            ) as any
        ) as any;
    }

    private childCommandContributor!: NavigationContributor;
    private childRoute!: RecognizedRoute;

    async construct(phase: NavigationPhase) {
        const rest = phase.route.params.child || "";
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

        await this.tryRunChildPhase(phase);
    }

    async tryEnter(phase: NavigationPhase) {
        await this.tryRunChildPhase(phase);
    }

    async commit(phase: NavigationPhase) {
        await this.tryRunChildPhase(phase);
    }

    async rollback(phase: NavigationPhase) {
        await this.tryRunChildPhase(phase);
    }

    private async tryRunChildPhase(phase: NavigationPhase) {
        const route = this.childRoute;
        const contributor = this.childCommandContributor;

        if (!route || !contributor) {
            return;
        }

        if (isNavigationPhaseContributor(contributor, phase.name)) {
            const currentRoute = phase.route; //HACK
            (phase as any).route = route;
            await contributor[phase.name](phase);
            (phase as any).route = currentRoute;
        }
    }
}
