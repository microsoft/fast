import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Pane as BasePane,
    PaneHandledProps as BasePaneHandledProps,
    PaneProps as BasePaneProps,
    PaneClassNamesContract,
    PaneManagedClasses,
    PaneResizeControlProps,
    PaneResizeDirection,
    paneStyleSheet,
    PaneUnhandledProps,
} from "./pane";

const Pane = manageJss(paneStyleSheet)(BasePane);
type Pane = typeof Pane;

type PaneHandledProps = Omit<BasePaneHandledProps, keyof PaneManagedClasses>;
type PaneProps = ManagedJSSProps<BasePaneProps, PaneClassNamesContract, undefined>;

export {
    Pane,
    PaneProps,
    PaneHandledProps,
    PaneUnhandledProps,
    PaneClassNamesContract,
    PaneResizeDirection,
    PaneResizeControlProps,
};
