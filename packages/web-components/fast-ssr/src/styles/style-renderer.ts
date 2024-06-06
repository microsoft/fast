import { ComposableStyles } from "@microsoft/fast-element";
import { fastStyleTagName } from "./fast-style-config.js";
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
    render(styles: Set<string | CSSStyleSheet>): string;
}

export class FASTStyleStyleRenderer implements StyleRenderer {
    private static stylesheetCache = new Map<ComposableStyles, string>();
    private static nextId = (() => {
        let id = 0;
        const prefix = "fast-style";
        return () => `${prefix}-${id++}`;
    })();

    public render(styles: Set<string | CSSStyleSheet>): string {
        let markup = "";

        styles.forEach(style => {
            let id = FASTStyleStyleRenderer.stylesheetCache.get(style);
            const content = id === undefined ? collectStyles(style) : null;
            let contentAttr = "";

            if (content !== null) {
                id = FASTStyleStyleRenderer.nextId();
                FASTStyleStyleRenderer.stylesheetCache.set(style, id);
                contentAttr = `css="${content}"`;
            }

            markup += `<${fastStyleTagName} style-id="${id}" ${contentAttr}></${fastStyleTagName}>`;
        });

        return markup;
    }
}

export class StyleElementStyleRenderer implements StyleRenderer {
    public render(styles: Set<string | CSSStyleSheet>): string {
        let styleTags = "";

        styles.forEach(style => {
            // for parity with PROD, return individual style elements
            styleTags += `<style>${collectStyles(style)}</style>`;
        });

        return styleTags;
    }
}
