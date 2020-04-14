import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { Subtract } from "utility-types";
import {
    Grid as BaseGrid,
    GridHandledProps as BaseGridHandledProps,
    GridProps as BaseGridProps,
    GridAlignment,
    GridClassNamesContract,
    GridGutter,
    GridManagedClasses,
    GridTag,
    GridUnhandledProps,
} from "./grid";

const Grid = manageJss()(BaseGrid);
type Grid = typeof Grid;

type GridHandledProps = Subtract<BaseGridHandledProps, GridManagedClasses>;
type GridProps = ManagedJSSProps<BaseGridProps, GridClassNamesContract, undefined>;

export {
    Grid,
    GridProps,
    GridHandledProps,
    GridUnhandledProps,
    GridClassNamesContract,
    GridTag,
    GridAlignment,
    GridGutter,
};
