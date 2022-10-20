import { DOMAspect, DOMPolicy, DOMSink } from "./dom.js";
import type { TrustedTypesPolicy } from "./interfaces.js";

export type DOMSinkGuards = Record<string, (DOMSink) => DOMSink>;

export type DOMAspectGuards = {
    [DOMAspect.attribute]?: DOMSinkGuards;
    [DOMAspect.booleanAttribute]?: DOMSinkGuards;
    [DOMAspect.property]?: DOMSinkGuards;
    [DOMAspect.content]?: DOMSinkGuards;
    [DOMAspect.tokenList]?: DOMSinkGuards;
    [DOMAspect.event]?: DOMSinkGuards;
};

export type DOMElementGuards = Record<string, DOMAspectGuards>;

export type DOMGuards = {
    elements: DOMElementGuards;
    aspects: DOMAspectGuards;
};

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

const defaultDOMElementGuards: DOMElementGuards = Object.freeze({
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
            srcdoc: block,
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
});

export const defaultDOMGuards = Object.freeze({
    elements: defaultDOMElementGuards,
    aspects: {
        [DOMAspect.property]: {
            innerHTML: block,
        },
    },
});

function tryGuard(
    aspectGuards: DOMAspectGuards,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
) {
    const sinkGuards = aspectGuards[aspect];

    if (sinkGuards) {
        const guard = sinkGuards[aspectName];
        if (guard) {
            return guard(sink);
        }
    }
}

const DOMPolicy = Object.freeze({
    create(
        fastTrustedType?: TrustedTypesPolicy,
        guards: DOMGuards = defaultDOMGuards
    ): DOMPolicy {
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

            protect(
                tagName: string | null,
                aspect: DOMAspect,
                aspectName: string,
                sink: DOMSink
            ): DOMSink {
                // Check for element-specific guards.
                const elementGuards = guards.elements[tagName ?? ""];
                if (elementGuards) {
                    const guard = tryGuard(elementGuards, aspect, aspectName, sink);
                    if (guard) {
                        return guard;
                    }
                }

                // Check for guards applicable to all nodes.
                const guard = tryGuard(guards.aspects, aspect, aspectName, sink);
                if (guard) {
                    return guard;
                }

                // No additional protection needed.
                return sink;
            },
        });
    },
});

export { DOMPolicy };
