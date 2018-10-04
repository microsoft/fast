import * as React from "react";
import manageJss, { ComponentStyles, ManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";
import { ComponentViewSlot } from "../";

export interface ISiteCategoryItemManagedClasses {
    siteCategoryItem: string;
}

export interface ISiteCategoryItemProps {
    slot?: ComponentViewSlot;
    categoryItemComponentMinWidth?: number;
    designSystem?: any;
    data: any;
    type?: string;
}

class SiteCategoryItem extends React.Component<ISiteCategoryItemProps, {}> {}

export default SiteCategoryItem;
