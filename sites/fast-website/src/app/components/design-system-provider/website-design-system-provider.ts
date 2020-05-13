import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import {
    designSystemProperty,
    designSystemProvider,
    FASTDesignSystemProvider,
} from "@microsoft/fast-components";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { observable } from "@microsoft/fast-element";

@designSystemProvider("website-design-system-provider")
export class WebsiteDesignSystemProvider extends FASTDesignSystemProvider {
    @observable
    @designSystemProperty({
        cssCustomProperty: false,
        default: [],
    })
    public accentPalette: string[];

    accentBaseColorChanged(): void {
        const parsedColor = parseColor(this.accentBaseColor);
        this.accentPalette = createColorPalette(parsedColor as ColorRGBA64);
    }
}
