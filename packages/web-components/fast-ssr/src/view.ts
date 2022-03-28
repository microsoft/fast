import { HTMLDirective, HTMLTemplateCompilationResult } from "@microsoft/fast-element";
import { Op, OpType, TemplateElementOpenOp } from "./template-parser/op-codes.js";
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
    public hostStaticAttributes?: TemplateElementOpenOp["staticAttributes"];
    public hostDynamicAttributes?: TemplateElementOpenOp["dynamicAttributes"];

    constructor(html: string, directives: ReadonlyArray<HTMLDirective>) {
        this.html = html;
        this.directives = directives;
        const codes = parseStringToOpCodes(html, directives);

        // Check to see if the root is a template element. We may need to
        // make this more sophisticated in the future because it doesn't quite
        // implement the same behavior as the client-side compiler
        // which uses Element.firstElementChild to check for template elements.
        if (codes.length) {
            const firstCode = codes[0];
            if (
                firstCode.type === OpType.templateElementOpen &&
                codes[codes.length - 1].type === OpType.templateElementClose
            ) {
                if (firstCode.staticAttributes.size) {
                    this.hostStaticAttributes = firstCode.staticAttributes;
                }

                if (firstCode.dynamicAttributes.length) {
                    this.hostDynamicAttributes = firstCode.dynamicAttributes;
                }

                codes.shift();
                codes.pop();
            }
        }
        this.codes = codes;
    }

    public createView(): this {
        return this;
    }
    public bind() {}
    public unbind() {}
    public appendTo() {}

    public static isSSRView(view: any): view is SSRView {
        return view instanceof SSRView;
    }
}
