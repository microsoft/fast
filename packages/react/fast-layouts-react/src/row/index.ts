import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Row as BaseRow,
    RowHandledProps as BaseRowHandledProps,
    RowProps as BaseRowProps,
    east,
    north,
    RowClassNamesContract,
    RowManagedClasses,
    RowResizeControlProps,
    RowResizeDirection,
    rowStyleSheet,
    RowUnhandledProps,
    south,
    west,
} from "./row";

const Row = manageJss(rowStyleSheet)(BaseRow);
type Row = typeof Row;

type RowHandledProps = Omit<BaseRowHandledProps, keyof RowManagedClasses>;
type RowProps = ManagedJSSProps<BaseRowProps, RowClassNamesContract, undefined>;

export {
    Row,
    RowProps,
    RowHandledProps,
    RowUnhandledProps,
    RowClassNamesContract,
    RowResizeDirection,
    RowResizeControlProps,
    east,
    west,
    north,
    south,
};
