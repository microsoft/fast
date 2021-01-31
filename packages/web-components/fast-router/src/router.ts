import { FASTElement, HTMLView } from "@microsoft/fast-element";
import { NavigationCommand } from "./commands";
import { RecognizedRoute } from "./recognizer";
import { NavigationContributor } from "./navigation-process";
import { RouteLocationResult } from "./routes";
import { composedParent } from "@microsoft/fast-foundation";

export interface Router extends FASTElement, HTMLElement {
    readonly route: RecognizedRoute | null;
    readonly command: NavigationCommand | null;
    readonly view: HTMLView | null;

    addContributor(contributor: NavigationContributor): void;
    removeContributor(contributor: NavigationContributor): void;

    findRoute<TSettings = any>(
        path: string
    ): Promise<RouteLocationResult<TSettings> | null>;
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
