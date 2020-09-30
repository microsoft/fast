import { Navigation } from "./navigation";

interface AnchorEventInfo {
    shouldHandleEvent: boolean;
    href: string | null;
    anchor: Element | null;
}

export interface LinkHandler {
    connect(): void;
    disconnect(): void;
}

export class DefaultLinkHandler implements LinkHandler {
    private handler = (e: MouseEvent) => {
        let { shouldHandleEvent, href } = this.getEventInfo(e);

        if (shouldHandleEvent) {
            e.preventDefault();
            Navigation.push(href!);
        }
    };

    public connect(): void {
        window.addEventListener("click", this.handler, true);
    }

    public disconnect(): void {
        window.removeEventListener("click", this.handler);
    }

    private getEventInfo(event: MouseEvent): AnchorEventInfo {
        const info: AnchorEventInfo = {
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

    private findClosestAnchor(event: MouseEvent): Element {
        const path: EventTarget[] = event.composedPath();

        for (let i = 0, ii = path.length; i < ii; ++i) {
            const current = path[i] as any;

            if (current.tagName === "A") {
                return current;
            }
        }

        return event.target as any;
    }

    private targetIsThisWindow(target: Element): boolean {
        const targetWindow = target.getAttribute("target");

        return !targetWindow || targetWindow === window.name || targetWindow === "_self";
    }
}
