import { DOMAspect, DOMPolicy, DOMSink } from "./dom.js";
import type { TrustedTypesPolicy } from "./interfaces.js";

export type DOMAspectGuards = Record<string, (DOMSink) => DOMSink>;

export type DOMElementGuards = Record<
    string,
    {
        [DOMAspect.attribute]?: DOMAspectGuards;
        [DOMAspect.booleanAttribute]?: DOMAspectGuards;
        [DOMAspect.property]?: DOMAspectGuards;
        [DOMAspect.content]?: DOMAspectGuards;
        [DOMAspect.tokenList]?: DOMAspectGuards;
        [DOMAspect.event]?: DOMAspectGuards;
    }
>;

function safeURL(sink: DOMSink): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        if (value !== null && value !== void 0) {
            // TODO
            return value;
        }

        sink(target, name, value, ...rest);
    };
}

function block(sink: DOMSink): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        // TODO
    };
}

const defaultDOMGuards: DOMElementGuards = {
    A: {
        [DOMAspect.attribute]: {
            href: safeURL,
        },
        [DOMAspect.property]: {
            href: safeURL,
        },
    },
    AREA: {
        [DOMAspect.attribute]: {
            href: safeURL,
        },
        [DOMAspect.property]: {
            href: safeURL,
        },
    },
    BUTTON: {
        [DOMAspect.attribute]: {
            formaction: safeURL,
        },
        [DOMAspect.property]: {
            formAction: safeURL,
        },
    },
    EMBED: {
        [DOMAspect.attribute]: {
            src: block,
        },
        [DOMAspect.property]: {
            src: block,
        },
    },
    FORM: {
        [DOMAspect.attribute]: {
            formaction: safeURL,
        },
        [DOMAspect.property]: {
            formAction: safeURL,
        },
    },
    FRAME: {
        [DOMAspect.attribute]: {
            src: safeURL,
        },
        [DOMAspect.property]: {
            src: safeURL,
        },
    },
    IFRAME: {
        [DOMAspect.attribute]: {
            src: safeURL,
        },
        [DOMAspect.property]: {
            src: safeURL,
        },
    },
    INPUT: {
        [DOMAspect.attribute]: {
            formaction: safeURL,
        },
        [DOMAspect.property]: {
            formAction: safeURL,
        },
    },
    OBJECT: {
        [DOMAspect.attribute]: {
            codebase: block,
            data: block,
        },
        [DOMAspect.property]: {
            codeBase: block,
            data: block,
        },
    },
    SCRIPT: {
        [DOMAspect.attribute]: {
            src: block,
            text: block,
        },
        [DOMAspect.property]: {
            src: block,
            text: block,
            innerText: block,
            textContent: block,
        },
    },
};

const DOMPolicy = Object.freeze({
    create(fastTrustedType?: TrustedTypesPolicy, guards?: DOMElementGuards): DOMPolicy {
        if (!fastTrustedType) {
            const createHTML = html => html;
            fastTrustedType = globalThis.trustedTypes
                ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
                : { createHTML };
        }

        if (!guards) {
            guards = defaultDOMGuards;
        }

        return Object.freeze({
            createHTML(value: string): string {
                return fastTrustedType!.createHTML(value);
            },

            protect(
                tagName: string | null,
                aspect: DOMAspect,
                aspectName: string,
                sink: DOMSink
            ): DOMSink {
                const elementLookup = guards![tagName ?? ""];
                if (elementLookup) {
                    const aspectLookup = elementLookup[aspect];
                    if (aspectLookup) {
                        const guard = aspectLookup[aspectName];
                        if (guard) {
                            return guard(sink);
                        }
                    }
                }

                return sink;
            },
        });
    },
});

export { DOMPolicy };
