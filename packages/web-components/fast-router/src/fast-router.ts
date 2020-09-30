import {
    customElement,
    FASTElement,
    HTMLView,
    observable,
} from "@microsoft/fast-element";
import { NavigationEnlistment } from "./enlistment";
import { NavigationAttempt } from "./transaction";
import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";

@customElement("fast-router")
export class FASTRouter extends FASTElement implements Router {
    private enlistment: NavigationEnlistment | null = null;
    private participants = new Set<any>();

    @observable public config: RouterConfiguration | null = null;
    @observable public readonly view: HTMLView | null = null;
    @observable public readonly command: NavigationCommand | null = null;
    @observable public readonly route: RecognizedRoute | null = null;

    configChanged() {
        if (this.config === null) {
            return;
        }

        this.tryConnectEnlistment();
    }

    connectedCallback() {
        super.connectedCallback();
        this.enlistment = NavigationEnlistment.enlist(this);
        this.tryConnectEnlistment();
    }

    tryConnectEnlistment() {
        if (
            this.config !== null &&
            this.enlistment !== null &&
            this.enlistment.managesNavigation
        ) {
            this.enlistment.connect(this.config);
        }
    }

    addNavigationParticipant(participant: any): void {
        this.participants.add(participant);
        console.log("add participant", participant, this);
    }

    removeNavigationParticipant(participant: any): void {
        this.participants.delete(participant);
        console.log("remove participant", participant, this);
    }

    async tryLeave(attempt: NavigationAttempt) {
        await attempt.runLifecycle(Array.from(this.participants));
    }

    async tryEnter(attempt: NavigationAttempt) {
        await attempt.runLifecycle(Array.from(this.participants));
    }
}
