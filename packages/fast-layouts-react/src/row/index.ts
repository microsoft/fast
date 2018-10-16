import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Row as BaseRow,
    RowClassNamesContract,
    RowHandledProps as BaseRowHandledProps,
    RowManagedClasses,
    RowProps as BaseRowProps,
    RowResizeDirection,
    rowStyleSheet,
    RowUnhandledProps
} from "./row";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Row = manageJss(rowStyleSheet)(BaseRow);
type Row = typeof Row;

interface RowHandledProps extends Subtract<BaseRowHandledProps, RowManagedClasses> {}
type RowProps = ManagedJSSProps<BaseRowProps, RowClassNamesContract, undefined>;

export {
    Row,
    RowProps,
    RowHandledProps,
    RowUnhandledProps,
    RowClassNamesContract,
    RowResizeDirection
};
