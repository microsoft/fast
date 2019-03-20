import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    east,
    north,
    Row as BaseRow,
    RowClassNamesContract,
    RowHandledProps as BaseRowHandledProps,
    RowManagedClasses,
    RowProps as BaseRowProps,
    RowResizeDirection,
    rowStyleSheet,
    RowUnhandledProps,
    south,
    west,
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
    RowResizeDirection,
    east,
    west,
    north,
    south,
};
