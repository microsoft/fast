import * as React from "react";
import {
    Tabs as BaseTabs,
    TabsClassNameContract,
    TabsHandledProps as BaseTabsHandledProps,
    TabsManagedClasses,
    TabsProps as BaseTabsProps,
    TabsUnhandledProps as PivotUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CardStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*tslint:disable-next-line:typedef */
const Pivot = manageJss(CardStyles)(BaseTabs);
type Pivot = InstanceType<typeof Pivot>;

interface PivotHandledProps extends Subtract<BaseTabsHandledProps, TabsManagedClasses> {}
type PivotProps = ManagedJSSProps<BaseTabsProps, TabsClassNameContract, DesignSystem>;

export {
    Pivot,
    PivotProps,
    TabsClassNameContract,
    PivotHandledProps,
    PivotUnhandledProps,
};
