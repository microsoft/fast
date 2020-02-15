import { attr, FastElement, observable, Observable } from "@microsoft/fast-element";

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

function camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Custom property reflector for the stub
 */
function cssCustomProperty(target: {}, name: string): void {
    const store = `_${name}`;

    Reflect.defineProperty(target, name, {
        enumerable: true,
        get(this: any): string {
            return this[store];
        },
        set(this: any, value: any): void {
            if (this[store] !== value) {
                this[store] = value;

                this.style.setProperty(`--${camelToKebab(name)}`, value);
            }
        },
    });
}

export class DesignSystemProvider extends FastElement implements DesignSystemData {
    @cssCustomProperty
    public accentBaseColor: string = "#0078D4";

    @cssCustomProperty
    public backgroundColor: string = "#FFFFFF";

    @cssCustomProperty
    public cornerRadius: number = 2;

    @cssCustomProperty
    public disabledOpacity = 0.3;

    @cssCustomProperty
    public density = 0.5;

    @cssCustomProperty
    public designUnit = 4;

    @cssCustomProperty
    public elevatedCornerRadius = 4;

    @cssCustomProperty
    public focusOutlineWidth: number = 2;

    @cssCustomProperty
    public outlineWidth = 1;
}
