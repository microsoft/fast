import {
    HTMLTemplateCompilationResult,
    ViewBehaviorFactory,
} from "@microsoft/fast-element";
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
    public readonly factories: Record<string, ViewBehaviorFactory>;
    public result: HTMLTemplateCompilationResult | null = null;
    public codes: Op[];
    public hostStaticAttributes?: TemplateElementOpenOp["staticAttributes"];
    public hostDynamicAttributes?: TemplateElementOpenOp["dynamicAttributes"];

    constructor(html: string, factories: Record<string, ViewBehaviorFactory>) {
        this.html = html;
        this.factories = factories;
        const codes = parseStringToOpCodes(html, factories, true);

        /**
         * If the first and last codes are template elements, populate static
         * and dynamic attributes for the host element and remove those op codes.
         */
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
