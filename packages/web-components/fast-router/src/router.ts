import { FASTElement, HTMLView } from "@microsoft/fast-element";
import { NavigationAttempt } from "./transaction";
import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";

export interface Router extends FASTElement, HTMLElement {
    readonly route: RecognizedRoute | null;
    readonly command: NavigationCommand | null;
    readonly view: HTMLView | null;

    addNavigationParticipant(participant: any): void;
    removeNavigationParticipant(participant: any): void;

    tryLeave(attempt: NavigationAttempt): Promise<void>;
    tryEnter(attempt: NavigationAttempt): Promise<void>;
}
