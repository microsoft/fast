import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import Explorer from "./explorer";
import { accent } from "./explorer.style";
import { Footer } from "./site-footer";

const accentPaletteSource: ColorRGBA64 | null = parseColor(accent);
let creatorDesignSystem: DesignSystem = DesignSystemDefaults;

if (accentPaletteSource !== null) {
    const palette: string[] = createColorPalette(accentPaletteSource);
    creatorDesignSystem = Object.assign({}, DesignSystemDefaults, {
        density: -2,
        accentBaseColor: accent,
        accentPalette: palette,
        baseLayerLuminance: StandardLuminance.DarkMode,
    });
}

class ExplorerRegion extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={creatorDesignSystem}>
                <Explorer {...this.props} />
                <Footer />
            </DesignSystemProvider>
        );
    }
}

export default ExplorerRegion;
