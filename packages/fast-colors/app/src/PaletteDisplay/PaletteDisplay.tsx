/*---------
  IMPORTS
----------*/

import * as React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  ColorInterpolationSpace,
  ColorPalette,
  ColorRGBA64,
  parseColor
} from "colorlib";
import ColorSwatch from "./ColorSwatch";

/*------------
  JSS STYLES
-------------*/

interface IPaletteDisplayNameContract {
  outerContainer: string;
}

const styles: ComponentStyles<IPaletteDisplayNameContract, any> = {
  outerContainer: {
    display: "flex",
    flexFlow: "column nowrap",
    width: "200px",
    margin: "8px 8px 8px 8px"
  }
};

/*----------------
  PROPS & STATES
-----------------*/

interface IPaletteDisplayProps {
  id:number;
  managedClasses: IPaletteDisplayNameContract;
  onBaseColorChanged?: (sourceId:number, newColor: ColorRGBA64) => void;
  steps?: number;
  baseColor: ColorRGBA64;
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

class PaletteDisplay extends React.Component<IPaletteDisplayProps> {
  /*-------------
    CONSTRUCTOR
  --------------*/

  constructor(props: IPaletteDisplayProps) {
    super(props);
  }

  private onBaseColorInputChanged(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    if (this.props.onBaseColorChanged) {
      const newColor: ColorRGBA64 = parseColor(e.target.value)!;
      this.props.onBaseColorChanged(this.props.id, newColor);
    }
  }

  /*--------------
    REACT RENDER
  ---------------*/

  public render(): JSX.Element {
    const palette: ColorPalette = new ColorPalette(
      this.props.baseColor,
      this.props.steps ? this.props.steps : 7,
      this.props.interpolationMode ? this.props.interpolationMode : null,
      this.props.scaleColorLight ? this.props.scaleColorLight : null,
      this.props.scaleColorDark ? this.props.scaleColorDark : null,
      this.props.clipLight ? this.props.clipLight : null,
      this.props.clipDark ? this.props.clipDark : null,
      this.props.saturationAdjustmentCutoff
        ? this.props.saturationAdjustmentCutoff
        : null,
      this.props.saturationLight ? this.props.saturationLight : null,
      this.props.saturationDark ? this.props.saturationDark : null,
      this.props.overlayLight ? this.props.overlayLight : null,
      this.props.overlayDark ? this.props.overlayDark : null,
      this.props.multiplyLight ? this.props.multiplyLight : null,
      this.props.multiplyDark ? this.props.multiplyDark : null
    );

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
          value={this.props.baseColor.toStringHexRGB()}
          onChange={e => this.onBaseColorInputChanged(e)}
        />
        {paletteItemDivs}
      </div>
    );
  }
}

export default manageJss(styles)(PaletteDisplay);
