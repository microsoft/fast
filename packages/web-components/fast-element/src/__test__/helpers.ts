import type { DOMAspect, DOMSink } from "../dom.js";

export function toHTML(node: Node, preserveCommentMarkup: boolean = false): string {
    return Array.from(node.childNodes)
        .map((x: any) => {
            if (preserveCommentMarkup && x.nodeType === 8) {
                return `<!--${x.textContent}-->`;
            }

            return x.outerHTML || x.textContent;
        })
        .join("");
}

export function createTrackableDOMPolicy() {
    return {
        used: false,
        createHTML: (html: string) => html,
        protect(
            tagName: string | null,
            aspect: DOMAspect,
            aspectName: string,
            sink: DOMSink
        ) {
            return (node: Node, aspectName:string, value: string, ...args: any[]) => {
                this.used = true;
                sink(node, aspectName, value, ...args);
            };
        },
    };
}
