import { attr, FastElement } from "@microsoft/fast-element";

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

const clamp = (min: number, max: number) => (value: number) =>
    Math.min(max, Math.max(min, value));

export class DesignSystemProvider extends FastElement implements DesignSystemData {
    @attr({ attribute: "accent-base-color" })
    public accentBaseColor: string = "#0078D4";

    @attr({ attribute: "background-color" })
    public backgroundColor: string = "#FFFFFF";

    @attr({ attribute: "corner-radius" })
    public cornerRadius: number = 2;

    private _disabledOpacity = 0.3;
    @attr({ attribute: "disabled-opacity" })
    public get disabledOpacity() {
        return this._disabledOpacity;
    }
    public set disabledOpacity(value: number) {
        this._disabledOpacity = clamp(0, 1)(value);
    }

    private _density = 0.5;
    @attr
    public get density() {
        return this._density;
    }
    public set density(value: number) {
        this._density = clamp(0, 1)(value);
    }

    @attr({ attribute: "design-unit" })
    public designUnit = 4;

    @attr({ attribute: "elevated-corner-radius" })
    public elevatedCornerRadius = 4;

    @attr({ attribute: "focus-outline-width" })
    public focusOutlineWidth: number;

    @attr({ attribute: "outline-width" })
    public outlineWidth = 1;
}
