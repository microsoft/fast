import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { FastElement, observable, Observable } from "@microsoft/fast-element";

/**
 * The following interface is an implementation of
 * design-system.schema.json in TypeScript with
 * as much accuracy as TypeScript supports.
 */
export interface DesignSystemData {
    accentBaseColor: string;
    backgroundColor: string;
    cornerRadius: number;
    disabledOpacity: number;
    density: number;
    designUnit: number;
    elevatedCornerRadius: number;
    focusOutlineWidth: number;
    outlineWidth: number;
}

/**
 * Custom property reflector for the stub
 */
function designSystemProperty(target: DesignSystemProvider, name: string): void {
    const store = `_${name}`;
    const callbackName = `${name}Changed`;

    Reflect.defineProperty(target, name, {
        enumerable: true,
        get(this: any): string {
            Observable.track(this, name);
            return this[store];
        },
        set(this: any, value: any): void {
            if (this[store] !== value) {
                this[store] = value;
                Observable.notify(this, name);
                this.designSystem = { ...this.designSystem, [name]: value };

                if (typeof this[callbackName] === "function") {
                    this[callbackName]();
                }
            }
        },
    });
}

export class DesignSystemProvider extends FastElement implements DesignSystemData {
    @designSystemProperty
    public accentBaseColor: string = "#0078D4";
    private accentBaseColorChanged(): void {
        const color = parseColorHexRGB(this.accentBaseColor);
        if (color !== null) {
            this.designSystem = {
                ...this.designSystem,
                accentPalette: createColorPalette(color),
            };
        }
    }

    @designSystemProperty
    public backgroundColor: string = "#FFFFFF";

    @designSystemProperty
    public baseHeightMultiplier: number = 8;

    @designSystemProperty
    public bodyFont: string = "Segoe UI, sans-serif";

    @designSystemProperty
    public cornerRadius: number = 2;

    @designSystemProperty
    public disabledOpacity = 0.3;

    @designSystemProperty
    public density = 0;

    @designSystemProperty
    public designUnit = 4;

    @designSystemProperty
    public elevatedCornerRadius = 4;

    @designSystemProperty
    public focusOutlineWidth = 2;

    @designSystemProperty
    public outlineWidth = 1;

    @observable
    public designSystem: DesignSystem = DesignSystemDefaults;
}
