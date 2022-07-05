import { ComposableStyles } from "@microsoft/fast-element";
import { fastStyleTagName } from "./fast-style.js";
function collectStyles(style: ComposableStyles): string {
    let content: string = "";
    if (typeof style === "string") {
        content = style;
    } else if (style instanceof CSSStyleSheet) {
        const rules = style.cssRules;

        for (let i = 0, length = rules.length; i < length; i++) {
            content += rules[i].cssText;
        }
    } else {
        for (const s of style.styles) {
            content += collectStyles(s);
        }
    }

    return content;
}

/**
 * A renderer for {@link @microsoft/fast-element#ComposableStyles}
 * @beta
 */
export interface StyleRenderer {
    /**
     * Renders composable styles to a string.
     * @param styles - The styles to render.
     */
    render(styles: ComposableStyles): string;
}

export class FASTStyleStyleRenderer implements StyleRenderer {
    private static stylesheetCache = new Map<ComposableStyles, string>();
    private static nextId = (() => {
        let id = 0;
        const prefix = "fast-style";
        return () => `${prefix}-${id++}`;
    })();

    public render(styles: ComposableStyles): string {
        let id = FASTStyleStyleRenderer.stylesheetCache.get(styles);
        const content = id === undefined ? collectStyles(styles) : null;
        let contentAttr = "";

        if (content !== null) {
            id = FASTStyleStyleRenderer.nextId();
            FASTStyleStyleRenderer.stylesheetCache.set(styles, id);
            contentAttr = `css="${content}"`;
        }

        return `<${fastStyleTagName} style-id="${id}" ${contentAttr}></${fastStyleTagName}>`;
    }
}

export class StyleElementStyleRenderer implements StyleRenderer {
    public render(styles: ComposableStyles): string {
        return `<style>${collectStyles(styles)}</style>`;
    }
}
