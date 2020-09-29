import { FASTElement } from "@microsoft/fast-element";
import { CSSCustomPropertyTarget } from "../custom-properties";
import { DesignSystemProvider, designSystemProperty } from "../design-system-provider";

const stylesheetCache = new Map<DesignSystemProvider | null, CSSStyleSheet>();
const cssCustomPropertyDefCache = new Map();

/**
 * An Card Custom HTML Element.
 *
 * @public
 */
export class Card extends DesignSystemProvider {
    @designSystemProperty({
        attribute: "background-color",
        default: "#FFFFFF",
    })
    public backgroundColor: string;

    public getCustomPropertyTargetSheet(): CSSStyleSheet {
        let sheet = stylesheetCache.get(this.provider);

        if (sheet) {
            return sheet;
        }

        sheet = new CSSStyleSheet();
        stylesheetCache.set(this.provider, sheet);

        return sheet;
    }

    connectedCallback() {
        let defs = cssCustomPropertyDefCache.get(this.provider);

        if (defs) {
            this.cssCustomPropertyDefinitions = defs;
        } else {
            defs = new Map();
            this.cssCustomPropertyDefinitions = defs;
            cssCustomPropertyDefCache.set(this.provider, defs);
        }

        super.connectedCallback();
    }
}
