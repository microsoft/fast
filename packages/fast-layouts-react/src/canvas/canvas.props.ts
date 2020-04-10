import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CanvasClassNamesContract } from "./canvas";

export type CanvasManagedClasses = ManagedClasses<CanvasClassNamesContract>;
export type CanvasUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export interface CanvasHandledProps extends CanvasManagedClasses {
    /**
     * The minimum width of the Canvas
     */
    minWidth?: number;
}

export type CanvasProps = CanvasHandledProps & CanvasUnhandledProps;
