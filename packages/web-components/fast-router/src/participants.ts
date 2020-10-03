import { Behavior, Directive, DOM, ExecutionContext } from "@microsoft/fast-element";
import { findParentRouter } from "./enlistment";
import { Router } from "./router";

export type ParticipantOptions = {
    lifecycle?: boolean;
    parameters?: boolean;
};

const defaultOptions: ParticipantOptions = {
    lifecycle: true,
    parameters: true
};

class NavigationParticipantDirective extends Directive {
    constructor(private options: Required<ParticipantOptions>) {
        super();
    }

    createPlaceholder(index: number) {
        return DOM.createCustomAttributePlaceholder(
            'fast-navigation-participant',
            index
        );
    }

    createBehavior(target: HTMLElement) {
        return new NavigationParticipantBehavior(target, this.options);
    }
}

class NavigationParticipantBehavior implements Behavior {
    private router: Router | null = null;

    constructor(private participant: HTMLElement, private options: Required<ParticipantOptions>) { }

    bind(source: unknown, context: ExecutionContext): void {
        if (this.options.lifecycle) {
            this.router = findParentRouter(this.participant)!;
            this.router.addNavigationParticipant(this.participant);
        }

        if (this.options.parameters) {
            const participant = this.participant as any;
            const routeParams = source as any;

            for (const key in routeParams) {
                participant[key] = routeParams[key];
            }
        }
    }

    unbind(source: unknown): void {
        if (this.router !== null) {
            this.router.removeNavigationParticipant(this.participant);
        }
    }
}

export function navigationParticipant(options?: ParticipantOptions) {
    return new NavigationParticipantDirective(
        Object.assign({}, defaultOptions, options) as Required<ParticipantOptions>
    );
}