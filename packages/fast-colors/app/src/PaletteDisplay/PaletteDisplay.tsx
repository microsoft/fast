import React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    ColorPalette,
    ColorRGBA64,
    IColorPaletteConfig,
    parseColor,
} from "../../../src/colorlib";
import ColorSwatch from "./ColorSwatch";

interface IPaletteDisplayNameContract {
    outerContainer: string;
}

const styles: ComponentStyles<IPaletteDisplayNameContract, any> = {
    outerContainer: {
        display: "flex",
        flexFlow: "column nowrap",
        width: "200px",
        margin: "8px 8px 8px 8px",
    },
};

interface IPaletteDisplayProps {
    id: number;
    managedClasses: IPaletteDisplayNameContract;
    onBaseColorChanged?: (sourceId: number, newColor: ColorRGBA64) => void;
    paletteConfig: IColorPaletteConfig;
}

class PaletteDisplay extends React.Component<IPaletteDisplayProps> {
    constructor(props: IPaletteDisplayProps) {
        super(props);
    }

    private onBaseColorInputChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        if (this.props.onBaseColorChanged) {
            const newColor: ColorRGBA64 = parseColor(e.target.value)!;
            this.props.onBaseColorChanged(this.props.id, newColor);
        }
    }

    public render(): JSX.Element {
        const palette: ColorPalette = new ColorPalette(this.props.paletteConfig);

        const paletteItemDivs: JSX.Element[] = palette.palette.map(
            (a: ColorRGBA64, index: number) => {
                return <ColorSwatch key={index} color={a} />;
            }
        );

        return (
            <div className={this.props.managedClasses.outerContainer}>
                <label htmlFor="baseColorInput">
                    Base color which will be used as the exact middle point of the palette
                </label>
                <input
                    id="scaleColorLightInput"
                    type="color"
                    value={this.props.paletteConfig.baseColor.toStringHexRGB()}
                    onChange={e => this.onBaseColorInputChanged(e)}
                />
                {paletteItemDivs}
            </div>
        );
    }
}

export default manageJss(styles)(PaletteDisplay);
