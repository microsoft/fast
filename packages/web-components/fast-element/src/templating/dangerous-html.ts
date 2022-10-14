import { HTMLDirective } from "./html-directive.js";
import type { CaptureType } from "./template.js";

/**
 * A directive capable of injecting static HTML platform runtime protection.
 * @public
 */
export class DangerousHTMLDirective implements HTMLDirective {
    constructor(private html: string) {}
    createHTML(): string {
        return this.html;
    }
}

HTMLDirective.define(DangerousHTMLDirective);

/**
 * Injects static HTML without platform protection.
 * @param html - The html to injection.
 * @returns A DangerousHTMLDirective.
 * @public
 */
export function dangerousHTML<TSource = any, TParent = any>(
    html: string
): CaptureType<TSource, TParent> {
    return new DangerousHTMLDirective(html);
}
