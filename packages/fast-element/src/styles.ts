const elementStylesBrand = Symbol();

export interface ElementStyles {
    readonly styles: InjectableStyles[];
    applyTo(shadowRoot: ShadowRoot): void;
}

type InjectableStyles = string | ElementStyles;
type ElementStyleFactory = (styles: InjectableStyles[]) => ElementStyles;

function isElementStyles(object: any): object is ElementStyles {
    return object.brand === elementStylesBrand;
}

function reduceStyles(styles: InjectableStyles[]): string[] {
    return styles
        .map((x: InjectableStyles) => (isElementStyles(x) ? reduceStyles(x.styles) : [x]))
        .reduce((prev: string[], curr: string[]) => prev.concat(curr), []);
}

type HasAdoptedStyleSheets = ShadowRoot & {
    adoptedStyleSheets: CSSStyleSheet[];
};

export class AdoptedStyleSheetsStyles implements ElementStyles {
    public readonly brand: symbol = elementStylesBrand;
    private readonly styleSheets: CSSStyleSheet[];

    public constructor(
        public styles: InjectableStyles[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        this.styleSheets = reduceStyles(styles).map((x: string) => {
            let sheet = styleSheetCache.get(x);

            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                (sheet as any).replaceSync(x);
                styleSheetCache.set(x, sheet);
            }

            return sheet;
        });
    }

    public applyTo(shadowRoot: HasAdoptedStyleSheets): void {
        // https://wicg.github.io/construct-stylesheets/
        // https://developers.google.com/web/updates/2019/02/constructable-stylesheets
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.styleSheets,
        ];
    }
}

export class StyleElementStyles implements ElementStyles {
    public readonly brand: symbol = elementStylesBrand;
    private styleSheets: string[];

    public constructor(public styles: InjectableStyles[]) {
        this.styleSheets = reduceStyles(styles);
    }

    public applyTo(shadowRoot: ShadowRoot): void {
        const styleSheets = this.styleSheets;

        for (let i = styleSheets.length - 1; i > -1; --i) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            shadowRoot.prepend(element);
        }
    }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createStyles: ElementStyleFactory = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const styleSheetCache = new Map();
        return (styles: InjectableStyles[]) =>
            new AdoptedStyleSheetsStyles(styles, styleSheetCache);
    }

    return (styles: InjectableStyles[]) => new StyleElementStyles(styles);
})();
/* eslint-enable @typescript-eslint/explicit-function-return-type */

export function css(
    strings: TemplateStringsArray,
    ...values: InjectableStyles[]
): ElementStyles {
    const styles: InjectableStyles[] = [];
    let cssString = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        const value = values[i];

        if (isElementStyles(value)) {
            styles.push(value);
        } else {
            cssString += value;
        }
    }

    cssString += strings[strings.length - 1];
    styles.push(cssString);

    return createStyles(styles);
}
