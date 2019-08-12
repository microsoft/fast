import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColorRGBA64, parseColor, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import Explorer from "./explorer";

const accent: string = "#FB356D";
const accentPaletteSource: ColorRGBA64 | null = parseColor(accent);
let creatorDesignSystem: DesignSystem = DesignSystemDefaults;

if (accentPaletteSource !== null) {
    const palette: string[] = createColorPalette(accentPaletteSource);
    creatorDesignSystem = Object.assign({}, DesignSystemDefaults, {
        density: -2,
        accentBaseColor: accent,
        accentPalette: palette,
        backgroundColor:
            DesignSystemDefaults.neutralPalette[
                DesignSystemDefaults.neutralPalette.length - 1
            ],
    });
}

class ExplorerRegion extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={creatorDesignSystem}>
                <Explorer {...this.props} />
            </DesignSystemProvider>
        );
    }
}

export default ExplorerRegion;
