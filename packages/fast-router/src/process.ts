import { NavigationMessage } from "./navigation.js";
import { isNavigationPhaseContributor } from "./contributors.js";
import {
    NavigationCommitPhase,
    NavigationPhaseFollowupAction,
    NavigationPhaseName,
} from "./phases.js";
import { RecognizedRoute } from "./recognizer.js";
import { Router } from "./router.js";

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
        router: Router<TSettings>,
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
        const level = this.router.level;

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

/**
 * @beta
 */
export interface NavigationProcess {
    run(router: Router, message: NavigationMessage): Promise<void>;
}

/**
 * @beta
 */
export class DefaultNavigationProcess<TSettings> {
    private phases: NavigationPhaseName[] = [
        "navigate",
        "leave",
        "construct",
        "enter",
        "commit",
    ];

    public async run(router: Router, message: NavigationMessage) {
        const events = router.config!.createEventSink();
        const match = await router.config!.recognizeRoute(message.path);

        if (match === null) {
            events.onUnhandledNavigationMessage(router, message);
            return;
        }

        const route = match.route;
        const command = match.command;

        events.onNavigationBegin(router, route, command);

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

            events.onPhaseBegin(phase);

            if (phase.canceled) {
                finalActions = cancelActions;
            } else {
                for (const contributor of contributors) {
                    await phase.evaluateContributor(contributor);

                    if (phase.canceled) {
                        finalActions = cancelActions;
                        break;
                    }
                }
            }

            events.onPhaseEnd(phase);

            if (phase.canceled) {
                break;
            }
        }

        await Promise.all(finalActions.map(x => x())).then(() =>
            events.onNavigationEnd(router, route, command)
        );
    }

    commit(phase: NavigationPhaseImpl) {
        const builder = phase.router.config!.createTitleBuilder();
        document.title = builder.buildTitle(phase.router.config!.title, phase.titles);
    }
}
