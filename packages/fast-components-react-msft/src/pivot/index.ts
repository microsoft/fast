import * as React from "react";
import {
    Tabs as BaseTabs,
    TabsHandledProps as BaseTabsHandledProps,
    TabsManagedClasses,
    TabsProps as BaseTabsProps,
    TabsUnhandledProps as PivotUnhandledProps,
} from "@microsoft/fast-components-react-base";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { PivotStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*tslint:disable-next-line:typedef */
const Pivot = manageJss(PivotStyles)(BaseTabs);
type Pivot = InstanceType<typeof Pivot>;

interface PivotHandledProps extends Subtract<BaseTabsHandledProps, TabsManagedClasses> {}
type PivotProps = ManagedJSSProps<BaseTabsProps, PivotClassNameContract, DesignSystem>;

export * from "./pivot";

export {
    Pivot,
    PivotProps,
    PivotClassNameContract,
    PivotHandledProps,
    PivotUnhandledProps,
};
