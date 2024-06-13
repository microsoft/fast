import {
    AddViewBehaviorFactory,
    HTMLDirective,
    Markup,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewController,
} from "@microsoft/fast-element";
import {
    NavigationCommitPhaseHook,
    NavigationPhaseHook,
    NavigationPhaseName,
} from "./phases.js";
import { Router } from "./router.js";
import { RouterExecutionContext } from "./view.js";

/**
 * @beta
 */
export type NavigationContributor<TSettings = any> = Partial<
    Record<Exclude<NavigationPhaseName, "commit">, NavigationPhaseHook<TSettings>>
> & {
    commit?: NavigationCommitPhaseHook<TSettings>;
};

/**
 * @beta
 */
export function isNavigationPhaseContributor<T extends NavigationPhaseName>(
    object: any,
    phase: T
): object is Record<T, NavigationPhaseHook> {
    return phase in object;
}

/**
 * @beta
 */
export type ContributorOptions = {
    lifecycle?: boolean;
    parameters?: boolean;
};

const defaultOptions: ContributorOptions = {
    lifecycle: true,
    parameters: true,
};

class NavigationContributorDirective implements ViewBehaviorFactory {
    targetNodeId!: string;

    constructor(public readonly options: Required<ContributorOptions>) {}

    createHTML(add: AddViewBehaviorFactory) {
        return Markup.attribute(add(this));
    }

    createBehavior() {
        return new NavigationContributorBehavior(this);
    }
}

HTMLDirective.define(NavigationContributorDirective);

class NavigationContributorBehavior implements ViewBehavior {
    private router: Router | null = null;
    private contributor!: HTMLElement & NavigationContributor;

    constructor(private directive: NavigationContributorDirective) {}

    bind(controller: ViewController): void {
        const context = controller.context as RouterExecutionContext;
        const options = this.directive.options;
        this.contributor = controller.targets[
            this.directive.targetNodeId
        ] as HTMLElement & NavigationContributor;

        if (options.lifecycle) {
            this.router = context.router ?? Router.find(this.contributor);

            if (this.router) {
                this.router.addContributor(this.contributor);
                controller.onUnbind(this);
            }
        }

        if (options.parameters) {
            const contributor = this.contributor as any;
            const routeParams = controller.source;

            for (const key in routeParams) {
                contributor[key] = routeParams[key];
            }
        }
    }

    unbind(source: unknown): void {
        this.router!.removeContributor(this.contributor);
    }
}

/**
 * @beta
 */
export function navigationContributor(
    options?: ContributorOptions
): NavigationContributorDirective {
    return new NavigationContributorDirective(
        Object.assign({}, defaultOptions, options) as Required<ContributorOptions>
    );
}
