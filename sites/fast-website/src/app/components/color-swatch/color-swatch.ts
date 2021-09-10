import { parseColorHexRGB } from "@microsoft/fast-colors";
import { accentPalette, PaletteRGB } from "@microsoft/fast-components";
import { attr, observable } from "@microsoft/fast-element";
import { Radio } from "@microsoft/fast-foundation";
import { keyEnter } from "@microsoft/fast-web-utilities";

export declare interface ColorSelectionResult {
    sRGBHex: string;
}

export declare class EyeDropper {
    constructor();
    public open(): Promise<ColorSelectionResult>;
}

export class ColorSwatch extends Radio {
    private palette: PaletteRGB;

    @observable
    public defaultSlottedNodes: Node[];

    private eyedropper: EyeDropper;

    @attr({
        attribute: "custom-value",
        mode: "boolean",
    })
    customValue: boolean = false;

    constructor() {
        super();

        if ("EyeDropper" in globalThis) {
            this.eyedropper = new EyeDropper();
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.eyedropper && this.customValue) {
            this.addEventListener("keydown", this.keydownHandler);
        }
    }

    public keydownHandler(e: KeyboardEvent): boolean | void {
        if (e.key === keyEnter) {
            this.getColorFromEyeDropper();
        }
    }

    public clickHandler(e: MouseEvent): boolean | void {
        if (!this.customValue || !this.eyedropper) {
            return super.clickHandler(e);
        }

        this.getColorFromEyeDropper().then(() => {
            return super.clickHandler(e);
        });
    }

    public async getColorFromEyeDropper() {
        try {
            const colorSelectionResult = await this.eyedropper.open();
            this.value = colorSelectionResult.sRGBHex;
            this.$emit("change");
        } catch (err) {
            console.log(err);
        }
    }

    public valueChanged(prev: unknown, next: string): void {
        const parsedColor = parseColorHexRGB(next);
        if (parsedColor) {
            this.palette = PaletteRGB.from(parsedColor);
            accentPalette.setValueFor(this, this.palette);
        }
    }
}
