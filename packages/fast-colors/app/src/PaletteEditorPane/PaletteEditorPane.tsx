import React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    ColorInterpolationSpace,
    ColorPalette,
    IColorPaletteConfig,
    parseColor,
} from "../../../src/colorlib";

interface IPaletteEditorPaneNameContract {
    outerContainer: string;
}

const styles: ComponentStyles<IPaletteEditorPaneNameContract, any> = {
    outerContainer: {
        display: "flex",
        flexFlow: "column noWrap",
        margin: "8px 8px 8px 8px",
    },
};

interface IPaletteEditorPaneProps {
    managedClasses: IPaletteEditorPaneNameContract;
    onParamsChanged?: (e: IColorPaletteConfig) => void;
    paletteConfig: IColorPaletteConfig;
}

class PaletteEditorPane extends React.Component<IPaletteEditorPaneProps> {
    constructor(props: IPaletteEditorPaneProps) {
        super(props);
    }

    public resetToDefault(): void {
        if (this.props.onParamsChanged) {
            this.props.onParamsChanged(ColorPalette.defaultPaletteConfig);
        }
    }

    private generateArgs(): IColorPaletteConfig {
        return {
            steps: this.props.paletteConfig.steps
                ? this.props.paletteConfig.steps
                : ColorPalette.defaultPaletteConfig.steps,
            interpolationMode: this.props.paletteConfig.interpolationMode
                ? this.props.paletteConfig.interpolationMode
                : ColorPalette.defaultPaletteConfig.interpolationMode,
            scaleColorLight: this.props.paletteConfig.scaleColorLight
                ? this.props.paletteConfig.scaleColorLight
                : ColorPalette.defaultPaletteConfig.scaleColorLight,
            scaleColorDark: this.props.paletteConfig.scaleColorDark
                ? this.props.paletteConfig.scaleColorDark
                : ColorPalette.defaultPaletteConfig.scaleColorDark,
            clipLight: this.props.paletteConfig.clipLight
                ? this.props.paletteConfig.clipLight
                : ColorPalette.defaultPaletteConfig.clipLight,
            clipDark: this.props.paletteConfig.clipDark
                ? this.props.paletteConfig.clipDark
                : ColorPalette.defaultPaletteConfig.clipDark,
            saturationAdjustmentCutoff: this.props.paletteConfig
                .saturationAdjustmentCutoff
                ? this.props.paletteConfig.saturationAdjustmentCutoff
                : ColorPalette.defaultPaletteConfig.saturationAdjustmentCutoff,
            saturationLight: this.props.paletteConfig.saturationLight
                ? this.props.paletteConfig.saturationLight
                : ColorPalette.defaultPaletteConfig.saturationLight,
            saturationDark: this.props.paletteConfig.saturationDark
                ? this.props.paletteConfig.saturationDark
                : ColorPalette.defaultPaletteConfig.saturationDark,
            overlayLight: this.props.paletteConfig.overlayLight
                ? this.props.paletteConfig.overlayLight
                : ColorPalette.defaultPaletteConfig.overlayLight,
            overlayDark: this.props.paletteConfig.overlayDark
                ? this.props.paletteConfig.overlayDark
                : ColorPalette.defaultPaletteConfig.overlayDark,
            multiplyLight: this.props.paletteConfig.multiplyLight
                ? this.props.paletteConfig.multiplyLight
                : ColorPalette.defaultPaletteConfig.multiplyLight,
            multiplyDark: this.props.paletteConfig.multiplyDark
                ? this.props.paletteConfig.multiplyDark
                : ColorPalette.defaultPaletteConfig.multiplyDark,
        };
    }

    private onSelectFieldChanged(e: React.ChangeEvent<HTMLSelectElement>): void {
        if (!this.props.onParamsChanged) {
            return;
        }
        const args: IColorPaletteConfig = this.generateArgs();

        if (e.target.id === "interpolationModeInput") {
            args.interpolationMode = Number(e.target.value) as ColorInterpolationSpace;
        }

        this.props.onParamsChanged(args);
    }

    private onInputFieldChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!this.props.onParamsChanged) {
            return;
        }
        const args: IColorPaletteConfig = this.generateArgs();

        switch (e.target.id) {
            case "stepsInput":
                args.steps = e.target.valueAsNumber;
                break;
            case "scaleColorLightInput":
                args.scaleColorLight = parseColor(e.target.value)!;
                break;
            case "scaleColorDarkInput":
                args.scaleColorDark = parseColor(e.target.value)!;
                break;
            case "clipLightInput":
                args.clipLight = e.target.valueAsNumber;
                break;
            case "clipDarkInput":
                args.clipDark = e.target.valueAsNumber;
                break;
            case "saturationAdjustmentCutoffInput":
                args.saturationAdjustmentCutoff = e.target.valueAsNumber;
                break;
            case "saturationLightInput":
                args.saturationLight = e.target.valueAsNumber;
                break;
            case "saturationDarkInput":
                args.saturationDark = e.target.valueAsNumber;
                break;
            case "overlayLightInput":
                args.overlayLight = e.target.valueAsNumber;
                break;
            case "overlayDarkInput":
                args.overlayDark = e.target.valueAsNumber;
                break;
            case "multiplyLightInput":
                args.multiplyLight = e.target.valueAsNumber;
                break;
            case "multiplyDarkInput":
                args.multiplyDark = e.target.valueAsNumber;
                break;
        }

        this.props.onParamsChanged(args);
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.outerContainer}>
                <button onClick={e => this.resetToDefault()}>Reset to Defaults</button>
                <label htmlFor="stepsInput">Number of colors in palette</label>
                <input
                    id="stepsInput"
                    type="number"
                    step={1}
                    min={1}
                    max={100}
                    value={
                        this.props.paletteConfig.steps
                            ? this.props.paletteConfig.steps
                            : ColorPalette.defaultPaletteConfig.steps
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="interpolationModeInput">
                    Which color space to use when calculating the colors between the ends
                    and the middle of the paltte. RGB, LAB or XYZ are recomended
                </label>
                <select
                    value={
                        this.props.paletteConfig.interpolationMode
                            ? this.props.paletteConfig.interpolationMode
                            : ColorPalette.defaultPaletteConfig.interpolationMode
                    }
                    id="interpolationModeInput"
                    onChange={e => this.onSelectFieldChanged(e)}
                >
                    <option value={ColorInterpolationSpace.RGB}>RGB</option>
                    <option value={ColorInterpolationSpace.HSL}>HSL</option>
                    <option value={ColorInterpolationSpace.HSV}>HSV</option>
                    <option value={ColorInterpolationSpace.XYZ}>XYZ</option>
                    <option value={ColorInterpolationSpace.LAB}>LAB</option>
                    <option value={ColorInterpolationSpace.LCH}>LCH</option>
                </select>
                <label htmlFor="scaleColorLightInput">
                    Color to use at the extreme light end of the color scale prior to
                    applying the clip or any blending
                </label>
                <input
                    id="scaleColorLightInput"
                    type="color"
                    value={
                        this.props.paletteConfig.scaleColorLight
                            ? this.props.paletteConfig.scaleColorLight.toStringHexRGB()
                            : ColorPalette.defaultPaletteConfig.scaleColorLight.toStringHexRGB()
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="scaleColorDarkInput">
                    Color to use at the extreme dark end of the color scale prior to
                    applying the clip or any blending
                </label>
                <input
                    id="scaleColorDarkInput"
                    type="color"
                    value={
                        this.props.paletteConfig.scaleColorDark
                            ? this.props.paletteConfig.scaleColorDark.toStringHexRGB()
                            : ColorPalette.defaultPaletteConfig.scaleColorDark.toStringHexRGB()
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="clipLightInput">
                    Amount to remove from the light end of the palette
                </label>
                <input
                    id="clipLightInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={0.5}
                    value={
                        this.props.paletteConfig.clipLight
                            ? this.props.paletteConfig.clipLight
                            : ColorPalette.defaultPaletteConfig.clipLight
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="clipDarkInput">
                    Amount to remove from the dark end of the palette
                </label>
                <input
                    id="clipDarkInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={0.5}
                    value={
                        this.props.paletteConfig.clipDark
                            ? this.props.paletteConfig.clipDark
                            : ColorPalette.defaultPaletteConfig.clipDark
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="saturationAdjustmentCutoffInput">
                    Saturation adjustment will only be applied if the saturation (in HSL
                    color space) of the base color is greater than or equal to this value
                </label>
                <input
                    id="saturationAdjustmentCutoffInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={1}
                    value={
                        this.props.paletteConfig.saturationAdjustmentCutoff
                            ? this.props.paletteConfig.saturationAdjustmentCutoff
                            : ColorPalette.defaultPaletteConfig.saturationAdjustmentCutoff
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="saturationLightInput">
                    Amount to saturate (using the LCH color space) the light end of the
                    palette
                </label>
                <input
                    id="saturationLightInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={3}
                    value={
                        this.props.paletteConfig.saturationLight
                            ? this.props.paletteConfig.saturationLight
                            : ColorPalette.defaultPaletteConfig.saturationLight
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="saturationDarkInput">
                    Amount to saturate (using the LCH color space) the dark end of the
                    palette
                </label>
                <input
                    id="saturationDarkInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={3}
                    value={
                        this.props.paletteConfig.saturationDark
                            ? this.props.paletteConfig.saturationDark
                            : ColorPalette.defaultPaletteConfig.saturationDark
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="overlayLightInput">
                    Amount to apply the overlay blend to the light end of the palette
                </label>
                <input
                    id="overlayLightInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={1}
                    value={
                        this.props.paletteConfig.overlayLight
                            ? this.props.paletteConfig.overlayLight
                            : ColorPalette.defaultPaletteConfig.overlayLight
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="overlayDarkInput">
                    Amount to apply the overlay blend to the dark end of the palette
                </label>
                <input
                    id="overlayDarkInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={1}
                    value={
                        this.props.paletteConfig.overlayDark
                            ? this.props.paletteConfig.overlayDark
                            : ColorPalette.defaultPaletteConfig.overlayDark
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="multiplyLightInput">
                    Amount to apply the multiply blend to the light end of the palette
                </label>
                <input
                    id="multiplyLightInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={1}
                    value={
                        this.props.paletteConfig.multiplyLight
                            ? this.props.paletteConfig.multiplyLight
                            : ColorPalette.defaultPaletteConfig.multiplyLight
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
                <label htmlFor="multiplyDarkInput">
                    Amount to apply the multiply blend to the dark end of the palette
                </label>
                <input
                    id="multiplyDarkInput"
                    type="range"
                    step={0.001}
                    min={0}
                    max={1}
                    value={
                        this.props.paletteConfig.multiplyDark
                            ? this.props.paletteConfig.multiplyDark
                            : ColorPalette.defaultPaletteConfig.multiplyDark
                    }
                    onChange={e => this.onInputFieldChanged(e)}
                />
            </div>
        );
    }
}

export default manageJss(styles)(PaletteEditorPane);
