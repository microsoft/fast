import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { Subtract } from "utility-types";
import {
    Column as BaseColumn,
    ColumnHandledProps as BaseColumnHandledProps,
    ColumnProps as BaseColumnProps,
    ColumnClassNamesContract,
    ColumnManagedClasses,
    ColumnUnhandledProps,
} from "./column";

const Column = manageJss()(BaseColumn);
type Column = typeof Column;

type ColumnHandledProps = Subtract<BaseColumnHandledProps, ColumnManagedClasses>;
type ColumnProps = ManagedJSSProps<BaseColumnProps, ColumnClassNamesContract, undefined>;

export {
    Column,
    ColumnProps,
    ColumnHandledProps,
    ColumnUnhandledProps,
    ColumnClassNamesContract,
};
