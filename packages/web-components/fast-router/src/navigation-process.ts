import { NavigationMessage } from "./navigation";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";

export type NavigationPhaseName = "navigate" | "leave" | "construct" | "enter" | "commit";

export type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<any> | any;

export type NavigationContributor<TSettings = any> = Partial<
    Record<NavigationPhaseName, NavigationPhaseHook<TSettings>>
>;

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
    readonly canceled: boolean;

    cancel(callback?: NavigationPhaseFollowupAction): void;
    onCancel(callback: NavigationPhaseFollowupAction): void;
    onCommit(callback: NavigationPhaseFollowupAction): void;

    evaluateContributor(
        contributor: any,
        route?: RecognizedRoute<TSettings>
    ): Promise<void>;
}

class NavigationPhaseImpl<TSettings = any> implements NavigationPhase<TSettings> {
    private routes: RecognizedRoute<TSettings>[] = [];
    canceled = false;

    get route(): RecognizedRoute<TSettings> {
        return this.routes[this.routes.length - 1]!;
    }

    constructor(
        public readonly name: NavigationPhaseName,
        route: RecognizedRoute<TSettings>,
        private readonly commitActions: NavigationPhaseFollowupAction[],
        private readonly cancelActions: NavigationPhaseFollowupAction[]
    ) {
        this.routes.push(route);
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

    async evaluateContributor(contributor: any, route = this.route): Promise<void> {
        if (isNavigationPhaseContributor(contributor, this.name)) {
            this.routes.push(route);
            await contributor[this.name](this);
            this.routes.pop();
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

    constructor(private router: Router, private message: NavigationMessage) {}

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
        const commandContributor = await command.createContributor(router, route);
        let finalActions = commitActions;

        for (const phaseName of this.phases) {
            console.log(`Phase: ${phaseName}`);

            const phase = new NavigationPhaseImpl<TSettings>(
                phaseName,
                route,
                commitActions,
                cancelActions
            );

            await phase.evaluateContributor(commandContributor);

            if (phase.canceled) {
                finalActions = cancelActions;
                break;
            }

            await phase.evaluateContributor(router);

            if (phase.canceled) {
                finalActions = cancelActions;
                break;
            }
        }

        await Promise.all(finalActions.map(x => x()));
    }
}
