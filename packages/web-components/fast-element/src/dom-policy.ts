import { DOMAspect, DOMPolicy, DOMSink } from "./dom.js";
import { isString, TrustedTypesPolicy } from "./interfaces.js";

export type DOMSinkGuards = Record<
    string,
    (
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: DOMSink
    ) => DOMSink
>;

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

function safeURL(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        if (isString(value)) {
            return value.replace("javascript:", "");
        }

        sink(target, name, value, ...rest);
    };
}

function block(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
): DOMSink {
    throw new Error(
        `${aspectName} on ${tagName ?? "text"} is blocked by the current DOMPolicy.`
    );
}

type DeepReadonly<T> = T extends (infer R)[]
    ? DeepReadonlyArray<R>
    : T extends Function
    ? T
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

function deepFreeze<T>(obj: T): DeepReadonly<T> {
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value === "object" && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    }

    return Object.freeze(obj) as DeepReadonly<T>;
}

const defaultDOMElementGuards = {
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
            action: safeURL,
        },
        [DOMAspect.property]: {
            action: safeURL,
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
    LINK: {
        [DOMAspect.attribute]: {
            href: block,
        },
        [DOMAspect.property]: {
            href: block,
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
    STYLE: {
        [DOMAspect.property]: {
            innerText: block,
            textContent: block,
        },
    },
};

const blockedEvents = {
    onabort: block,
    onauxclick: block,
    onbeforeinput: block,
    onbeforematch: block,
    onblur: block,
    oncancel: block,
    oncanplay: block,
    oncanplaythrough: block,
    onchange: block,
    onclick: block,
    onclose: block,
    oncontextlost: block,
    oncontextmenu: block,
    oncontextrestored: block,
    oncopy: block,
    oncuechange: block,
    oncut: block,
    ondblclick: block,
    ondrag: block,
    ondragend: block,
    ondragenter: block,
    ondragleave: block,
    ondragover: block,
    ondragstart: block,
    ondrop: block,
    ondurationchange: block,
    onemptied: block,
    onended: block,
    onerror: block,
    onfocus: block,
    onformdata: block,
    oninput: block,
    oninvalid: block,
    onkeydown: block,
    onkeypress: block,
    onkeyup: block,
    onload: block,
    onloadeddata: block,
    onloadedmetadata: block,
    onloadstart: block,
    onmousedown: block,
    onmouseenter: block,
    onmouseleave: block,
    onmousemove: block,
    onmouseout: block,
    onmouseover: block,
    onmouseup: block,
    onpaste: block,
    onpause: block,
    onplay: block,
    onplaying: block,
    onprogress: block,
    onratechange: block,
    onreset: block,
    onresize: block,
    onscroll: block,
    onsecuritypolicyviolation: block,
    onseeked: block,
    onseeking: block,
    onselect: block,
    onslotchange: block,
    onstalled: block,
    onsubmit: block,
    onsuspend: block,
    ontimeupdate: block,
    ontoggle: block,
    onvolumechange: block,
    onwaiting: block,
    onwebkitanimationend: block,
    onwebkitanimationiteration: block,
    onwebkitanimationstart: block,
    onwebkittransitionend: block,
    onwheel: block,
};

export const defaultDOMGuards = deepFreeze({
    elements: defaultDOMElementGuards,
    aspects: {
        [DOMAspect.attribute]: {
            ...blockedEvents,
        },
        [DOMAspect.property]: {
            innerHTML: block,
            ...blockedEvents,
        },
        [DOMAspect.event]: {
            ...blockedEvents,
        },
    },
});

function tryGuard(
    aspectGuards: DOMAspectGuards,
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
) {
    const sinkGuards = aspectGuards[aspect];

    if (sinkGuards) {
        const guard = sinkGuards[aspectName];
        if (guard) {
            return guard(tagName, aspect, aspectName, sink);
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
                    const guard = tryGuard(
                        elementGuards,
                        tagName,
                        aspect,
                        aspectName,
                        sink
                    );

                    if (guard) {
                        return guard;
                    }
                }

                // Check for guards applicable to all nodes.
                return (
                    tryGuard(guards.aspects, tagName, aspect, aspectName, sink) ?? sink
                );
            },
        });
    },
});

export { DOMPolicy };
