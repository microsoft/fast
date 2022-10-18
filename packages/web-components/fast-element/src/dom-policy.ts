import type { DOMAspect, DOMPolicy, DOMSink } from "./dom.js";
import type { TrustedTypesPolicy } from "./interfaces.js";

const DOMPolicy = Object.freeze({
    create(fastTrustedType?: TrustedTypesPolicy): DOMPolicy {
        if (!fastTrustedType) {
            const createHTML = html => html;
            fastTrustedType = globalThis.trustedTypes
                ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
                : { createHTML };
        }

        return Object.freeze({
            createHTML(value: string): string {
                return fastTrustedType!.createHTML(value);
            },

            protect<T extends DOMSink = DOMSink>(
                tagName: string | null,
                aspect: DOMAspect,
                aspectName: string,
                sink: T
            ): T {
                return sink;
            },
        });
    },
});

export { DOMPolicy };
