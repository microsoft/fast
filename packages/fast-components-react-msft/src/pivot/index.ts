import * as React from "react";
import MSFTPivot, {
    PivotHandledProps as MSFTPivotHandledProps,
    PivotManagedClasses,
    PivotProps as MSFTPivotProps,
    PivotUnhandledProps,
} from "./pivot";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { PivotStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*tslint:disable-next-line:typedef */
const Pivot = manageJss(PivotStyles)(MSFTPivot);
type Pivot = InstanceType<typeof Pivot>;

interface PivotHandledProps
    extends Subtract<MSFTPivotHandledProps, PivotManagedClasses> {}
type PivotProps = ManagedJSSProps<MSFTPivotProps, PivotClassNameContract, DesignSystem>;

export * from "./pivot";

export {
    Pivot,
    PivotProps,
    PivotClassNameContract,
    PivotHandledProps,
    PivotUnhandledProps,
};
