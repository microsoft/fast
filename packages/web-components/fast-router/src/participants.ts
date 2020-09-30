import { Behavior, Directive, DOM, ExecutionContext } from "@microsoft/fast-element";
import { findParentRouter } from "./enlistment";
import { Router } from "./router";

class NavigationParticipantDirective extends Directive {
    createPlaceholder(index: number) {
        return DOM.createCustomAttributePlaceholder("fast-navigation-participant", index);
    }

    createBehavior(target: HTMLElement) {
        return new NavigationParticipantBehavior(target);
    }
}

class NavigationParticipantBehavior implements Behavior {
    private router!: Router;

    constructor(private participant: HTMLElement) {}

    bind(source: unknown, context: ExecutionContext): void {
        this.router = findParentRouter(this.participant)!;
        this.router.addNavigationParticipant(this.participant);
    }

    unbind(source: unknown): void {
        this.router.removeNavigationParticipant(this.participant);
    }
}

const directive = new NavigationParticipantDirective();

export function navigationParticipant() {
    return directive;
}
