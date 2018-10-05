import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CanvasClassNamesContract } from "./canvas";

export interface CanvasHandledProps {
    /**
     * The minimum width of the Canvas
     */
    minWidth?: number;
}

export interface CanvasManagedClasses extends ManagedClasses<CanvasClassNamesContract> {}
export type CanvasProps = CanvasHandledProps & CanvasManagedClasses;
