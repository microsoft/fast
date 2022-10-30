import { html, repeat } from "@microsoft/fast-element";
import { isDark, Swatch } from "@microsoft/adaptive-ui";
import { PaletteGradient } from "./palette-gradient.js";

function getClass(swatch: Swatch, source?: Swatch, closestSource?: Swatch) {
    return swatch.toColorString() === source?.toColorString()
        ? "source"
        : swatch.toColorString() === closestSource?.toColorString()
        ? "source closest"
        : "";
}

function getColor(background: Swatch) {
    const darkMode = isDark(background);
    return darkMode ? "white" : "black";
}

export const paletteGradientTemplate = html<PaletteGradient>`
    ${repeat(
        x => x.palette?.swatches || [],
        html<Swatch, PaletteGradient>`
            <a
                class="${(x, c) =>
                    getClass(x, c.parent.palette?.source, c.parent.closestSource)}"
                style="background: ${x => x.toColorString()}; color: ${x => getColor(x)}"
                title="${(x, c) =>
                    c.index.toString().concat(": ", x.toColorString().toUpperCase())}"
            ></a>
        `,
        { positioning: true }
    )}
`;
