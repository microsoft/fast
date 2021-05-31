import {
    accentPalette,
    fillColor,
    neutralPalette,
    PaletteRGB,
    SwatchRGB,
} from "@microsoft/fast-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";

accentPalette.withDefault(
    PaletteRGB.create(SwatchRGB.fromObject(parseColorHexRGB("#0078D4")!))
);
fillColor.withDefault((target: HTMLElement) => neutralPalette.getValueFor(target).get(0));
