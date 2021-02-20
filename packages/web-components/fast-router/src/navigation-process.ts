import { RouterConfiguration } from "./configuration";
import { NavigationMessage } from "./navigation";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";

export type NavigationPhaseName = "navigate" | "leave" | "construct" | "enter" | "commit";

export type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<any> | any;

export type NavigationCommitPhaseHook<TSettings = any> = (
    phase: NavigationCommitPhase<TSettings>
) => Promise<any> | any;

export type NavigationContributor<TSettings = any> = Partial<
    Record<Exclude<NavigationPhaseName, "commit">, NavigationPhaseHook<TSettings>>
> & {
    commit?: NavigationCommitPhaseHook<TSettings>;
};

export function isNavigationPhaseContributor<T extends NavigationPhaseName>(
    object: any,
    phase: T
): object is Record<T, NavigationPhaseHook> {
    return phase in object;
}

type NavigationPhaseFollowupAction = () => Promise<any> | any;

export interface NavigationPhase<TSettings = any> {
    readonly name: NavigationPhaseName;
    readonly route: RecognizedRoute<TSettings>;
    readonly router: Router;
    readonly canceled: boolean;

    cancel(callback?: NavigationPhaseFollowupAction): void;
    onCancel(callback: NavigationPhaseFollowupAction): void;
    onCommit(callback: NavigationPhaseFollowupAction): void;

    evaluateContributor(
        contributor: any,
        route?: RecognizedRoute<TSettings>,
        router?: Router
    ): Promise<void>;
}

export interface NavigationCommitPhase<TSettings = any>
    extends NavigationPhase<TSettings> {
    setTitle(title: string);
}

class NavigationPhaseImpl<TSettings = any> implements NavigationCommitPhase<TSettings> {
    private routes: RecognizedRoute<TSettings>[] = [];
    private routers: Router[] = [];
    canceled = false;
    public titles: Array<Array<string>> = [];

    get route(): RecognizedRoute<TSettings> {
        return this.routes[this.routes.length - 1]!;
    }

    get router(): Router {
        return this.routers[this.routers.length - 1];
    }

    constructor(
        public readonly name: NavigationPhaseName,
        route: RecognizedRoute<TSettings>,
        router: Router,
        private readonly commitActions: NavigationPhaseFollowupAction[],
        private readonly cancelActions: NavigationPhaseFollowupAction[]
    ) {
        this.routes.push(route);
        this.routers.push(router);
    }

    cancel(callback?: NavigationPhaseFollowupAction): void {
        this.canceled = true;

        if (callback) {
            this.cancelActions.push(callback);
        }
    }

    onCommit(callback: NavigationPhaseFollowupAction): void {
        this.commitActions.push(callback);
    }

    onCancel(callback: NavigationPhaseFollowupAction): void {
        this.cancelActions.push(callback);
    }

    setTitle(title: string) {
        let level = this.router.level;

        while (this.titles.length < level + 1) {
            this.titles.push([]);
        }

        this.titles[level].push(title);
    }

    async evaluateContributor(
        contributor: any,
        route: RecognizedRoute<TSettings> = this.route,
        router: Router = this.router
    ): Promise<void> {
        if (isNavigationPhaseContributor(contributor, this.name)) {
            this.routes.push(route);
            this.routers.push(router);
            await contributor[this.name](this);
            this.routes.pop();
            this.routers.pop();
        }
    }
}

export interface NavigationProcess {
    run(): Promise<void>;
}

export class DefaultNavigationProcess<TSettings> {
    private phases: NavigationPhaseName[] = [
        "navigate",
        "leave",
        "construct",
        "enter",
        "commit",
    ];

    constructor(
        private router: Router,
        private config: RouterConfiguration,
        private message: NavigationMessage
    ) {}

    public async run() {
        const router = this.router;
        const routeResult = await router.findRoute(this.message.path);

        if (routeResult == null) {
            return;
        }

        const route = routeResult.route;
        const command = routeResult.command;
        const commitActions: NavigationPhaseFollowupAction[] = [];
        const cancelActions: NavigationPhaseFollowupAction[] = [];
        let finalActions = commitActions;
        const contributors = [
            await command.createContributor(router, route),
            router,
            this,
        ];

        for (const phaseName of this.phases) {
            const phase = new NavigationPhaseImpl<TSettings>(
                phaseName,
                route,
                router,
                commitActions,
                cancelActions
            );

            for (const contributor of contributors) {
                await phase.evaluateContributor(contributor);

                if (phase.canceled) {
                    finalActions = cancelActions;
                    break;
                }
            }

            if (phase.canceled) {
                break;
            }
        }

        await Promise.all(finalActions.map(x => x()));
    }

    commit(phase: NavigationPhaseImpl) {
        const builder = this.config.createTitleBuilder();
        document.title = builder.buildTitle(this.config.title, phase.titles);
    }
}
