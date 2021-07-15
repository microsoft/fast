import { Route } from "./navigation";
/**
 * @alpha
 */
export class DefaultLinkHandler {
    constructor() {
        this.handler = e => {
            let { shouldHandleEvent, href } = this.getEventInfo(e);
            if (shouldHandleEvent) {
                e.preventDefault();
                Route.path.push(href);
            }
        };
    }
    connect() {
        window.addEventListener("click", this.handler, true);
    }
    disconnect() {
        window.removeEventListener("click", this.handler);
    }
    getEventInfo(event) {
        const info = {
            shouldHandleEvent: false,
            href: null,
            anchor: null,
        };
        const target = this.findClosestAnchor(event);
        if (!target || !this.targetIsThisWindow(target)) {
            return info;
        }
        if (
            target.hasAttribute("download") ||
            target.hasAttribute("router-ignore") ||
            target.hasAttribute("data-router-ignore")
        ) {
            return info;
        }
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return info;
        }
        const href = target.getAttribute("href");
        info.anchor = target;
        info.href = href;
        const leftButtonClicked = event.which === 1;
        const isRelative = href && !(href.charAt(0) === "#" || /^[a-z]+:/i.test(href));
        info.shouldHandleEvent = leftButtonClicked && !!isRelative;
        return info;
    }
    findClosestAnchor(event) {
        const path = event.composedPath();
        for (let i = 0, ii = path.length; i < ii; ++i) {
            const current = path[i];
            if (current.tagName === "A") {
                return current;
            }
        }
        return event.target;
    }
    targetIsThisWindow(target) {
        const targetWindow = target.getAttribute("target");
        return !targetWindow || targetWindow === window.name || targetWindow === "_self";
    }
}
