/*---------
  IMPORTS
----------*/

import React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ColorRGBA64, contrastRatio } from "../../../src/colorlib";

/*------------
  JSS STYLES
-------------*/

interface IColorSwatchNameContract {
  outerContainer: string;
  itemContent: string;
}

const styles: ComponentStyles<IColorSwatchNameContract, any> = {
  outerContainer: {
    height: "50px",
    fontFamily: "monospace",
    display: "flex",
    alignItems: "center",
  },
  itemContent: {
    marginLeft: "12px",
    marginRight: "12px"
  }
};

/*----------------
  PROPS & STATES
-----------------*/

interface IColorSwatchProps {
  managedClasses: IColorSwatchNameContract;
  color: ColorRGBA64;
}

/*------------------
  CLASS DEFINITION
-------------------*/

class ColorSwatch extends React.Component<IColorSwatchProps> {
  /*-------------
    CONSTRUCTOR
  --------------*/

  constructor(props: IColorSwatchProps) {
    super(props);
  }

  private static readonly lightText: ColorRGBA64 = new ColorRGBA64(1, 1, 1, 1);
  private static readonly darkText: ColorRGBA64 = new ColorRGBA64(0, 0, 0, 1);

  /*--------------
    REACT RENDER
  ---------------*/

  public render(): JSX.Element {
    if (contrastRatio(ColorSwatch.lightText, this.props.color) >= 4.5) {
      return <div className={this.props.managedClasses.outerContainer}
        style={{
          background: this.props.color.toStringWebRGB(),
          color: ColorSwatch.lightText.toStringWebRGB()
        }} ><div className={this.props.managedClasses.itemContent}>{this.props.color.toStringHexRGB()}</div></div>;
    }
    else {
      return <div className={this.props.managedClasses.outerContainer}
        style={{
          background: this.props.color.toStringWebRGB(),
          color: ColorSwatch.darkText.toStringWebRGB()
        }} ><div className={this.props.managedClasses.itemContent}>{this.props.color.toStringHexRGB()}</div></div>;
    }
  }
}

export default manageJss(styles)(ColorSwatch);