import React from "react";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";
import { ComponentViewSlot } from "../";

export interface SiteCategoryItemManagedClasses {
    siteCategoryItem: string;
}

export interface SiteCategoryItemProps {
    slot?: ComponentViewSlot;
    categoryItemComponentMinWidth?: number;
    designSystem?: any;
    data: any;
    type?: string;
}

class SiteCategoryItem extends React.Component<SiteCategoryItemProps, {}> {}

export default SiteCategoryItem;
