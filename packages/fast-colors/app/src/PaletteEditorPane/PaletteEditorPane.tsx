/*---------
  IMPORTS
----------*/

import * as React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ColorInterpolationSpace, ColorPalette, ColorRGBA64, parseColor } from 'colorlib';

/*----------------
  EVENT ARGS
-----------------*/

export interface IPaletteEditorPaneParamsChangedArgs {
    steps: number;
    interpolationMode: ColorInterpolationSpace;
    scaleColorLight: ColorRGBA64;
    scaleColorDark: ColorRGBA64;
    clipLight: number;
    clipDark: number;
    saturationAdjustmentCutoff: number;
    saturationLight: number;
    saturationDark: number;
    overlayLight: number;
    overlayDark: number;
    multiplyLight: number;
    multiplyDark: number;
}

/*------------
  JSS STYLES
-------------*/

interface IPaletteEditorPaneNameContract {
    outerContainer: string;
}

const styles: ComponentStyles<IPaletteEditorPaneNameContract, any> = {
    outerContainer: {
        display: "flex",
        flexFlow: "column noWrap",
        margin: "8px 8px 8px 8px"
    }
};

/*----------------
  PROPS & STATES
-----------------*/

interface IPaletteEditorPaneProps {
    managedClasses: IPaletteEditorPaneNameContract;
    onParamsChanged?: (e: IPaletteEditorPaneParamsChangedArgs) => void;
    steps?: number;
    interpolationMode?: ColorInterpolationSpace;
    scaleColorLight?: ColorRGBA64;
    scaleColorDark?: ColorRGBA64;
    clipLight?: number;
    clipDark?: number;
    saturationAdjustmentCutoff?: number;
    saturationLight?: number;
    saturationDark?: number;
    overlayLight?: number;
    overlayDark?: number;
    multiplyLight?: number;
    multiplyDark?: number;
}

/*------------------
  CLASS DEFINITION
-------------------*/

class PaletteEditorPane extends React.Component<IPaletteEditorPaneProps> {
    /*-------------
      CONSTRUCTOR
    --------------*/

    constructor(props: IPaletteEditorPaneProps) {
        super(props);
    }

    public resetToDefault(): void {
        if (this.props.onParamsChanged) {
            this.props.onParamsChanged({
                steps: ColorPalette.defaultSteps,
                interpolationMode: ColorPalette.defaultInterpolationMode,
                scaleColorLight: ColorPalette.defaultScaleColorLight,
                scaleColorDark: ColorPalette.defaultScaleColorDark,
                clipLight: ColorPalette.defaultClipLight,
                clipDark: ColorPalette.defaultClipDark,
                saturationAdjustmentCutoff: ColorPalette.defaultSaturationAdjustmentCutoff,
                saturationLight: ColorPalette.defaultSaturationLight,
                saturationDark: ColorPalette.defaultSaturationDark,
                overlayLight: ColorPalette.defaultOverlayLight,
                overlayDark: ColorPalette.defaultOverlayDark,
                multiplyLight: ColorPalette.defaultMultiplyLight,
                multiplyDark: ColorPalette.defaultMultiplyDark
            });
        }
    }

    private onSelectFieldChanged(e: React.ChangeEvent<HTMLSelectElement>): void {
        if (!this.props.onParamsChanged) {
            return;
        }
        const args: IPaletteEditorPaneParamsChangedArgs = {
            steps: this.props.steps ? this.props.steps : ColorPalette.defaultSteps,
            interpolationMode: this.props.interpolationMode ? this.props.interpolationMode : ColorPalette.defaultInterpolationMode,
            scaleColorLight: this.props.scaleColorLight ? this.props.scaleColorLight : ColorPalette.defaultScaleColorLight,
            scaleColorDark: this.props.scaleColorDark ? this.props.scaleColorDark : ColorPalette.defaultScaleColorDark,
            clipLight: this.props.clipLight ? this.props.clipLight : ColorPalette.defaultClipLight,
            clipDark: this.props.clipDark ? this.props.clipDark : ColorPalette.defaultClipDark,
            saturationAdjustmentCutoff: this.props.saturationAdjustmentCutoff ? this.props.saturationAdjustmentCutoff : ColorPalette.defaultSaturationAdjustmentCutoff,
            saturationLight: this.props.saturationLight ? this.props.saturationLight : ColorPalette.defaultSaturationLight,
            saturationDark: this.props.saturationDark ? this.props.saturationDark : ColorPalette.defaultSaturationDark,
            overlayLight: this.props.overlayLight ? this.props.overlayLight : ColorPalette.defaultOverlayLight,
            overlayDark: this.props.overlayDark ? this.props.overlayDark : ColorPalette.defaultOverlayDark,
            multiplyLight: this.props.multiplyLight ? this.props.multiplyLight : ColorPalette.defaultMultiplyLight,
            multiplyDark: this.props.multiplyDark ? this.props.multiplyDark : ColorPalette.defaultMultiplyDark
        };

        if (e.target.id === "interpolationModeInput") {
            args.interpolationMode = Number(e.target.value) as ColorInterpolationSpace;
        }

        this.props.onParamsChanged(args);
    }

    private onInputFieldChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!this.props.onParamsChanged) {
            return;
        }
        const args: IPaletteEditorPaneParamsChangedArgs = {
            steps: this.props.steps ? this.props.steps : ColorPalette.defaultSteps,
            interpolationMode: this.props.interpolationMode ? this.props.interpolationMode : ColorPalette.defaultInterpolationMode,
            scaleColorLight: this.props.scaleColorLight ? this.props.scaleColorLight : ColorPalette.defaultScaleColorLight,
            scaleColorDark: this.props.scaleColorDark ? this.props.scaleColorDark : ColorPalette.defaultScaleColorDark,
            clipLight: this.props.clipLight ? this.props.clipLight : ColorPalette.defaultClipLight,
            clipDark: this.props.clipDark ? this.props.clipDark : ColorPalette.defaultClipDark,
            saturationAdjustmentCutoff: this.props.saturationAdjustmentCutoff ? this.props.saturationAdjustmentCutoff : ColorPalette.defaultSaturationAdjustmentCutoff,
            saturationLight: this.props.saturationLight ? this.props.saturationLight : ColorPalette.defaultSaturationLight,
            saturationDark: this.props.saturationDark ? this.props.saturationDark : ColorPalette.defaultSaturationDark,
            overlayLight: this.props.overlayLight ? this.props.overlayLight : ColorPalette.defaultOverlayLight,
            overlayDark: this.props.overlayDark ? this.props.overlayDark : ColorPalette.defaultOverlayDark,
            multiplyLight: this.props.multiplyLight ? this.props.multiplyLight : ColorPalette.defaultMultiplyLight,
            multiplyDark: this.props.multiplyDark ? this.props.multiplyDark : ColorPalette.defaultMultiplyDark
        };

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

    /*--------------
      REACT RENDER
    ---------------*/

    public render(): JSX.Element {
        return <div className={this.props.managedClasses.outerContainer}>
            <button onClick={e => this.resetToDefault()}>Reset to Defaults</button>
            <label htmlFor="stepsInput">Number of colors in palette</label>
            <input id="stepsInput" type="number" step={1} min={1} max={100} value={this.props.steps ? this.props.steps : ColorPalette.defaultSteps} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="interpolationModeInput">Which color space to use when calculating the colors between the ends and the middle of the paltte. RGB, LAB or XYZ are recomended</label>
            <select value={this.props.interpolationMode ? this.props.interpolationMode : ColorPalette.defaultInterpolationMode} id="interpolationModeInput" onChange={e => this.onSelectFieldChanged(e)}>
                <option value={ColorInterpolationSpace.RGB}>RGB</option>
                <option value={ColorInterpolationSpace.HSL}>HSL</option>
                <option value={ColorInterpolationSpace.HSV}>HSV</option>
                <option value={ColorInterpolationSpace.XYZ}>XYZ</option>
                <option value={ColorInterpolationSpace.LAB}>LAB</option>
                <option value={ColorInterpolationSpace.LCH}>LCH</option>
            </select>
            <label htmlFor="scaleColorLightInput">Color to use at the extreme light end of the color scale prior to applying the clip or any blending</label>
            <input id="scaleColorLightInput" type="color" value={this.props.scaleColorLight ? this.props.scaleColorLight.toStringHexRGB() : ColorPalette.defaultScaleColorLight.toStringHexRGB()} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="scaleColorDarkInput">Color to use at the extreme dark end of the color scale prior to applying the clip or any blending</label>
            <input id="scaleColorDarkInput" type="color" value={this.props.scaleColorDark ? this.props.scaleColorDark.toStringHexRGB() : ColorPalette.defaultScaleColorDark.toStringHexRGB()} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="clipLightInput">Amount to remove from the light end of the palette</label>
            <input id="clipLightInput" type="range" step={0.001} min={0} max={0.5} value={this.props.clipLight ? this.props.clipLight : ColorPalette.defaultClipLight} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="clipDarkInput">Amount to remove from the dark end of the palette</label>
            <input id="clipDarkInput" type="range" step={0.001} min={0} max={0.5} value={this.props.clipDark ? this.props.clipDark : ColorPalette.defaultClipDark} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="saturationAdjustmentCutoffInput">Saturation adjustment will only be applied if the saturation (in HSL color space) of the base color is greater than or equal to this value</label>
            <input id="saturationAdjustmentCutoffInput" type="range" step={0.001} min={0} max={1} value={this.props.saturationAdjustmentCutoff ? this.props.saturationAdjustmentCutoff : ColorPalette.defaultSaturationAdjustmentCutoff} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="saturationLightInput">Amount to saturate (using the LCH color space) the light end of the palette</label>
            <input id="saturationLightInput" type="range" step={0.001} min={0} max={3} value={this.props.saturationLight ? this.props.saturationLight : ColorPalette.defaultSaturationLight} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="saturationDarkInput">Amount to saturate (using the LCH color space) the dark end of the palette</label>
            <input id="saturationDarkInput" type="range" step={0.001} min={0} max={3} value={this.props.saturationDark ? this.props.saturationDark : ColorPalette.defaultSaturationDark} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="overlayLightInput">Amount to apply the overlay blend to the light end of the palette</label>
            <input id="overlayLightInput" type="range" step={0.001} min={0} max={1} value={this.props.overlayLight ? this.props.overlayLight : ColorPalette.defaultOverlayLight} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="overlayDarkInput">Amount to apply the overlay blend to the dark end of the palette</label>
            <input id="overlayDarkInput" type="range" step={0.001} min={0} max={1} value={this.props.overlayDark ? this.props.overlayDark : ColorPalette.defaultOverlayDark} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="multiplyLightInput">Amount to apply the multiply blend to the light end of the palette</label>
            <input id="multiplyLightInput" type="range" step={0.001} min={0} max={1} value={this.props.multiplyLight ? this.props.multiplyLight : ColorPalette.defaultMultiplyLight} onChange={e => this.onInputFieldChanged(e)} />
            <label htmlFor="multiplyDarkInput">Amount to apply the multiply blend to the dark end of the palette</label>
            <input id="multiplyDarkInput" type="range" step={0.001} min={0} max={1} value={this.props.multiplyDark ? this.props.multiplyDark : ColorPalette.defaultMultiplyDark} onChange={e => this.onInputFieldChanged(e)} />
        </div>
    }
}

export default manageJss(styles)(PaletteEditorPane);