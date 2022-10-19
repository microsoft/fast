import { Palette, Swatch } from "@microsoft/adaptive-ui";
import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { paletteGradientStyles as styles } from "./palette-gradient.styles.js";
import { paletteGradientTemplate as template } from "./palette-gradient.template.js";

@customElement({
    name: "app-palette-gradient",
    template,
    styles,
})
export class PaletteGradient extends FASTElement {
    closestSource?: Swatch;

    @observable
    palette?: Palette;
    private paletteChanged() {
        this.closestSource = this.palette?.get(
            this.palette?.closestIndexOf(this.palette?.source)
        );
    }
}
