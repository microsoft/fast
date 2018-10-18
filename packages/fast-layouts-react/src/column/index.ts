import * as React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    Column as BaseColumn,
    ColumnClassNamesContract,
    ColumnHandledProps as BaseColumnHandledProps,
    ColumnManagedClasses,
    ColumnProps as BaseColumnProps,
    columnStyleSheet,
    ColumnUnhandledProps
} from "./column";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Column = manageJss(columnStyleSheet)(BaseColumn);
type Column = typeof Column;

interface ColumnHandledProps
    extends Subtract<BaseColumnHandledProps, ColumnManagedClasses> {}
type ColumnProps = ManagedJSSProps<BaseColumnProps, ColumnClassNamesContract, undefined>;

export {
    Column,
    ColumnProps,
    ColumnHandledProps,
    ColumnUnhandledProps,
    ColumnClassNamesContract
};
