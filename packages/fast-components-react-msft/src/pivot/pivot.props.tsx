import * as React from "react";
import { Subtract } from "utility-types";
import {
    TabsHandledProps as BaseTabsHandledProps,
    TabsManagedClasses as BaseTabsManagedClasses,
    TabsUnhandledProps as BaseTabsUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    PivotClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface PivotManagedClasses extends ManagedClasses<PivotClassNameContract> {}
export interface PivotHandledProps
    extends PivotManagedClasses,
        Subtract<BaseTabsHandledProps, BaseTabsManagedClasses> {
    /**
     * The preceding content
     */
    beforeContent?: (classname?: string) => React.ReactNode;

    /**
     * The trailing content
     */
    afterContent?: (classname?: string) => React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface PivotUnhandledProps extends BaseTabsUnhandledProps {}
export type PivotProps = PivotHandledProps & PivotUnhandledProps;
