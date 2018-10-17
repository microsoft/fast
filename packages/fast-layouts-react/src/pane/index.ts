import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Pane as BasePane,
    PaneClassNamesContract,
    PaneHandledProps as BasePaneHandledProps,
    PaneManagedClasses,
    PaneProps as BasePaneProps,
    PaneResizeDirection,
    paneStyleSheet,
    PaneUnhandledProps
} from "./pane";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Pane = manageJss(paneStyleSheet)(BasePane);
type Pane = typeof Pane;

interface PaneHandledProps extends Subtract<BasePaneHandledProps, PaneManagedClasses> {}
type PaneProps = ManagedJSSProps<BasePaneProps, PaneClassNamesContract, undefined>;

export {
    Pane,
    PaneProps,
    PaneHandledProps,
    PaneUnhandledProps,
    PaneClassNamesContract,
    PaneResizeDirection,
};
