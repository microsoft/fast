import { FASTElement, HTMLView } from "@microsoft/fast-element";
import { composedParent } from "@microsoft/fast-foundation";
import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";
import { RouterConfiguration } from "./configuration";
import { NavigationContributor } from "./contributors";

export interface Router extends FASTElement, HTMLElement {
    readonly config: RouterConfiguration | null;
    readonly route: RecognizedRoute | null;
    readonly command: NavigationCommand | null;
    readonly view: HTMLView | null;
    readonly level: number;

    addContributor(contributor: NavigationContributor): void;
    removeContributor(contributor: NavigationContributor): void;
}

export const Router = Object.freeze({
    findParent(element: HTMLElement): Router | null {
        let parentNode: HTMLElement | null = element;

        while ((parentNode = composedParent(parentNode))) {
            if (parentNode.tagName === "FAST-ROUTER") {
                return parentNode as Router;
            }
        }

        return null;
    },
});
