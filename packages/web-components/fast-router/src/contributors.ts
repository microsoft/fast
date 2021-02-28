import {
    Behavior,
    defaultExecutionContext,
    Directive,
    DOM,
    ExecutionContext,
} from "@microsoft/fast-element";
import {
    NavigationCommitPhaseHook,
    NavigationPhaseHook,
    NavigationPhaseName,
} from "./phases";
import { Router } from "./router";

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

export type ContributorOptions = {
    lifecycle?: boolean;
    parameters?: boolean;
};

const defaultOptions: ContributorOptions = {
    lifecycle: true,
    parameters: true,
};

export type RouterExecutionContext = ExecutionContext & {
    router: Router;
};

export const RouterExecutionContext = Object.freeze({
    create(router: Router) {
        return Object.create(defaultExecutionContext, {
            router: {
                value: router,
            },
        });
    },
});

class NavigationContributorDirective extends Directive {
    constructor(private options: Required<ContributorOptions>) {
        super();
    }

    createPlaceholder(index: number) {
        return DOM.createCustomAttributePlaceholder("fast-navigation-contributor", index);
    }

    createBehavior(target: HTMLElement) {
        return new NavigationContributorBehavior(target, this.options);
    }
}

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

export function navigationContributor(options?: ContributorOptions): Directive {
    return new NavigationContributorDirective(
        Object.assign({}, defaultOptions, options) as Required<ContributorOptions>
    );
}
