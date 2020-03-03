import { Container, Registry, DI } from "./di";

export interface ShadowDOMStyles {
    applyTo(shadowRoot: ShadowRoot): void;
}

export const ShadowDOMStyles = DI.createInterface<ShadowDOMStyles>("ShadowDOMStyles");

type InjectableStyles = string | ShadowDOMRegistry;
type ShadowDOMStyleFactory = (styles: InjectableStyles[]) => ShadowDOMStyles;
type HasAdoptedStyleSheets = ShadowRoot & {
    adoptedStyleSheets: CSSStyleSheet[];
};

function reduceStyles(styles: InjectableStyles[]): string[] {
    return styles
        .map(x => (x instanceof ShadowDOMRegistry ? reduceStyles(x.styles) : [x]))
        .reduce((prev, curr) => prev.concat(curr), []);
}

export class ShadowDOMRegistry implements Registry {
    private static _createStyles: ShadowDOMStyleFactory;
    private get createStyles(): ShadowDOMStyleFactory {
        return (
            ShadowDOMRegistry._createStyles ||
            (ShadowDOMRegistry._createStyles = ShadowDOMRegistry.createStyleFactory())
        );
    }

    public constructor(public styles: InjectableStyles[]) {}

    public register(container: Container) {
        container.registerResolver(ShadowDOMStyles, () => this.createStyles(this.styles));
    }

    public static createStyleFactory(): ShadowDOMStyleFactory {
        if (AdoptedStyleSheetsStyles.supported()) {
            const styleSheetCache = new Map();
            return function(styles: InjectableStyles[]) {
                return new AdoptedStyleSheetsStyles(styles, styleSheetCache);
            };
        }

        return function(styles: InjectableStyles[]) {
            return new StyleElementStyles(styles);
        };
    }
}

export class AdoptedStyleSheetsStyles implements ShadowDOMStyles {
    private readonly styleSheets: CSSStyleSheet[];

    public constructor(
        styles: (string | ShadowDOMRegistry)[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        this.styleSheets = reduceStyles(styles).map(x => {
            let sheet = styleSheetCache.get(x);

            if (!sheet) {
                sheet = new CSSStyleSheet();
                (sheet as any).replaceSync(x);
                styleSheetCache.set(x, sheet);
            }

            return sheet;
        });
    }

    public static supported(): boolean {
        return "adoptedStyleSheets" in (window as any).ShadowRoot.prototype;
    }

    public applyTo(shadowRoot: HasAdoptedStyleSheets) {
        // https://wicg.github.io/construct-stylesheets/
        // https://developers.google.com/web/updates/2019/02/constructable-stylesheets
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.styleSheets,
        ];
    }
}

export class StyleElementStyles implements ShadowDOMStyles {
    public constructor(private styles: (string | ShadowDOMRegistry)[]) {}

    public applyTo(shadowRoot: ShadowRoot) {
        const styles = reduceStyles(this.styles);

        for (let i = styles.length - 1; i > -1; --i) {
            const element = document.createElement("style");
            element.innerHTML = styles[i];
            shadowRoot.prepend(element);
        }
    }
}

export function css(
    strings: TemplateStringsArray,
    ...values: (string | ShadowDOMRegistry)[]
): ShadowDOMRegistry {
    const styles: InjectableStyles[] = [];
    let cssString = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        const value = values[i];

        if (value instanceof ShadowDOMRegistry) {
            styles.push(value);
        } else {
            cssString += value;
        }
    }

    cssString += strings[strings.length - 1];
    styles.push(cssString);

    return new ShadowDOMRegistry(styles);
}
