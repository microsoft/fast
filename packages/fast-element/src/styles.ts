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
        .map(x => (isElementStyles(x) ? reduceStyles(x.styles) : [x]))
        .reduce((prev, curr) => prev.concat(curr), []);
}

type HasAdoptedStyleSheets = ShadowRoot & {
    adoptedStyleSheets: CSSStyleSheet[];
};

export class AdoptedStyleSheetsStyles implements ElementStyles {
    public readonly brand = elementStylesBrand;
    private readonly styleSheets: CSSStyleSheet[];

    public constructor(
        public styles: InjectableStyles[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        this.styleSheets = reduceStyles(styles).map(x => {
            let sheet = styleSheetCache.get(x);

            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                (sheet as any).replaceSync(x);
                styleSheetCache.set(x, sheet);
            }

            return sheet;
        });
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

export class StyleElementStyles implements ElementStyles {
    public readonly brand = elementStylesBrand;
    private styleSheets: string[];

    public constructor(public styles: InjectableStyles[]) {
        this.styleSheets = reduceStyles(styles);
    }

    public applyTo(shadowRoot: ShadowRoot) {
        const styleSheets = this.styleSheets;

        for (let i = styleSheets.length - 1; i > -1; --i) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            shadowRoot.prepend(element);
        }
    }
}

export const createStyles: ElementStyleFactory = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const styleSheetCache = new Map();
        return (styles: InjectableStyles[]) =>
            new AdoptedStyleSheetsStyles(styles, styleSheetCache);
    }

    return (styles: InjectableStyles[]) => new StyleElementStyles(styles);
})();

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
