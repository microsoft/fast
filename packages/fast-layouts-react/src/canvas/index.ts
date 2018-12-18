import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Canvas as BaseCanvas,
    CanvasClassNamesContract,
    CanvasHandledProps as BaseCanvasHandledProps,
    CanvasManagedClasses,
    CanvasProps as BaseCanvasProps,
    canvasStyleSheet,
    CanvasUnhandledProps,
} from "./canvas";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Canvas = manageJss(canvasStyleSheet)(BaseCanvas);
type Canvas = typeof Canvas;

interface CanvasHandledProps
    extends Subtract<BaseCanvasHandledProps, CanvasManagedClasses> {}
type CanvasProps = ManagedJSSProps<BaseCanvasProps, CanvasClassNamesContract, undefined>;

export {
    Canvas,
    CanvasProps,
    CanvasHandledProps,
    CanvasUnhandledProps,
    CanvasClassNamesContract,
};
