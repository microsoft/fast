import { HTMLDirective, HTMLTemplateCompilationResult } from "@microsoft/fast-element";
import { Op } from "./template-parser/op-codes.js";
import { parseStringToOpCodes } from "./template-parser/template-parser.js";

/**
 * SSR implementation of {@link @microsoft/fast-element#HTMLView}. Due to
 * drastic type difference requirements, it does not extend it directly. Most
 * methods are no-op. SSR op-codes are created during construction to be used
 * by the ElementRenderer.
 */
export class SSRView {
    public readonly html: string;
    public readonly directives: ReadonlyArray<HTMLDirective>;
    public result: HTMLTemplateCompilationResult | null = null;
    public codes: Op[];

    constructor(html: string, directives: ReadonlyArray<HTMLDirective>) {
        this.html = html;
        this.directives = directives;
        this.codes = parseStringToOpCodes(html, directives);
    }

    public createView(): this {
        return this;
    }
    public bind() {}
    public unbind() {}
    public appendTo() {}
}
