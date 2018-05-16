import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ICanvasClassNamesContract } from "./canvas";

export interface ICanvasHandledProps {
    /**
     * The minimum width of the Canvas
     */
    minWidth?: number;
}

export interface ICanvasUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ICanvasManagedClasses extends IManagedClasses<ICanvasClassNamesContract> {}
export type CanvasProps = ICanvasHandledProps & ICanvasUnhandledProps & ICanvasManagedClasses;
