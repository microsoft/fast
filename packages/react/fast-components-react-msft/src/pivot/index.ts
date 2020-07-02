import React from "react";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, PivotStyles } from "@microsoft/fast-components-styles-msft";
import pivotSchema from "./pivot.schema";
import pivotSchema2 from "./pivot.schema.2";
import MSFTPivot, {
    PivotHandledProps as MSFTPivotHandledProps,
    PivotProps as MSFTPivotProps,
    PivotManagedClasses,
    PivotUnhandledProps,
} from "./pivot";

const Pivot = manageJss(PivotStyles)(MSFTPivot);
type Pivot = InstanceType<typeof Pivot>;

type PivotHandledProps = Omit<MSFTPivotHandledProps, keyof PivotManagedClasses>;
type PivotProps = ManagedJSSProps<MSFTPivotProps, PivotClassNameContract, DesignSystem>;

export {
    Pivot,
    PivotClassNameContract,
    PivotProps,
    PivotHandledProps,
    pivotSchema,
    pivotSchema2,
    PivotUnhandledProps,
};
