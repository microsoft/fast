import { emptyArray } from "@microsoft/fast-element";
import { NavigationMessage } from "./navigation";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";

export type NavigationPhaseName =
    | "tryNavigate"
    | "tryLeave"
    | "construct"
    | "tryEnter"
    | "commit"
    | "rollback";

export enum NavigationPhaseState {
    inProgress,
    canceled,
    completed,
}

export type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<void>;

export type NavigationContributor<TSettings = any> = Partial<
    Record<NavigationPhaseName, NavigationPhaseHook<TSettings>>
>;

export function isNavigationPhaseContributor<T extends NavigationPhaseName>(
    object: any,
    phase: T
): object is Record<T, NavigationPhaseHook> {
    return phase in object;
}

type NavigationPhaseFollowupAction = () => Promise<void>;

export interface NavigationPhase<TSettings = any> {
    readonly name: NavigationPhaseName;
    readonly state: NavigationPhaseState;
    readonly route: RecognizedRoute<TSettings>;
    cancel(callback?: NavigationPhaseFollowupAction): void;
}

export interface NavigationPhaseResult {
    readonly state: NavigationPhaseState;
    readonly actions: NavigationPhaseFollowupAction[];
}

class NavigationPhaseImpl<TSettings>
    implements NavigationPhaseResult, NavigationPhase<TSettings> {
    private cancelActions: NavigationPhaseFollowupAction[] = [];
    state: NavigationPhaseState = NavigationPhaseState.inProgress;

    get actions() {
        switch (this.state) {
            case NavigationPhaseState.completed:
                return this.completeActions;
            case NavigationPhaseState.canceled:
                return this.cancelActions;
            default:
                return emptyArray as any;
        }
    }

    constructor(
        public readonly name: NavigationPhaseName,
        public readonly route: RecognizedRoute<TSettings>,
        private readonly completeActions: NavigationPhaseFollowupAction[]
    ) {}

    cancel(callback?: NavigationPhaseFollowupAction): void {
        this.state = NavigationPhaseState.canceled;

        if (callback) {
            this.cancelActions.push(callback);
        }
    }
}

export interface NavigationProcess {
    run(): Promise<void>;
}

export class DefaultNavigationProcess<TSettings> {
    private currentPhase: NavigationPhaseName = "tryNavigate";
    private phases: NavigationPhaseName[] = [
        "tryNavigate",
        "tryLeave",
        "construct",
        "tryEnter",
        "commit",
    ];

    constructor(private router: Router, private message: NavigationMessage) {}

    public async run() {
        const routeResult = await this.router.findRoute(this.message.path);

        if (routeResult == null) {
            return;
        }

        const route = routeResult.route;
        const command = routeResult.command;

        if (this.router.command === command) {
            // TODO: check parameters to see if they are different
            return;
        }

        let allowActions: NavigationPhaseFollowupAction[] = [];
        const commandContributor = await command.createContributor(this.router, route);

        for (const phase of this.phases) {
            this.currentPhase = phase;

            const phaseResult = (await this.runCurrentPhase(
                route,
                commandContributor,
                allowActions
            )) as NavigationPhaseResult;

            if (phaseResult.state === NavigationPhaseState.canceled) {
                for (let action of phaseResult.actions) {
                    await action();
                }

                return;
            } else {
                allowActions = phaseResult.actions;
            }
        }
    }

    private async runCurrentPhase(
        route: RecognizedRoute<TSettings>,
        commandContributor: NavigationContributor,
        allowActions: NavigationPhaseFollowupAction[]
    ): Promise<NavigationPhaseResult> {
        const phase = this.currentPhase;
        const state = new NavigationPhaseImpl<TSettings>(phase, route, allowActions);

        if (isNavigationPhaseContributor(commandContributor, phase)) {
            await commandContributor[phase](state);

            if (state.state === NavigationPhaseState.canceled) {
                return state;
            }
        }

        const applicable = this.router.findContributors(phase);
        console.log(`Phase: ${phase}`, applicable);

        for (const contributor of applicable) {
            await contributor[phase](state);

            if (state.state === NavigationPhaseState.canceled) {
                return state;
            }
        }

        state.state = NavigationPhaseState.completed;
        return state;
    }
}
