import {
    AddViewBehaviorFactory,
    Behavior,
    HTMLDirective,
    Markup,
    ViewBehaviorTargets,
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

class NavigationContributorDirective implements HTMLDirective {
    id: string;
    nodeId: string;

    constructor(private options: Required<ContributorOptions>) {}

    createHTML(add: AddViewBehaviorFactory) {
        return Markup.attribute(add(this));
    }

    createBehavior(targets: ViewBehaviorTargets) {
        return new NavigationContributorBehavior(
            targets[this.nodeId] as HTMLElement & NavigationContributor,
            this.options
        );
    }
}

HTMLDirective.define(NavigationContributorDirective);

class NavigationContributorBehavior implements Behavior {
    private router: Router | null = null;

    constructor(
        private contributor: HTMLElement & NavigationContributor,
        private options: Required<ContributorOptions>
    ) {}

    bind(source: unknown, context: RouterExecutionContext): void {
        if (this.options.lifecycle) {
            this.router = context.router || Router.find(this.contributor);
            this.router.addContributor(this.contributor);
        }

        if (this.options.parameters) {
            const contributor = this.contributor as any;
            const routeParams = source as any;

            for (const key in routeParams) {
                contributor[key] = routeParams[key];
            }
        }
    }

    unbind(source: unknown): void {
        if (this.router !== null) {
            this.router.removeContributor(this.contributor);
        }
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
