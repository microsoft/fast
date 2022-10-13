import { HTMLDirective } from "./html-directive.js";
import type { CaptureType } from "./template.js";

export class DangerousHTMLDirective implements HTMLDirective {
    constructor(private html: string) {}
    createHTML(): string {
        return this.html;
    }
}

HTMLDirective.define(DangerousHTMLDirective);

export function dangerousHTML<TSource = any, TParent = any>(
    html: string
): CaptureType<TSource, TParent> {
    return new DangerousHTMLDirective(html);
}
