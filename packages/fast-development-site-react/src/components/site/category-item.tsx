import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteCategoryItemManagedClasses {
    siteCategoryItem: string;
}

const style: ComponentStyles<ISiteCategoryItemManagedClasses, IDevSiteDesignSystem> = {
    siteCategoryItem: {
        display: "flex",
        flexWrap: "wrap",
        margin: toPx(24),
        borderTop: `${toPx(1)} solid rgb(226, 226, 226)`,
        borderLeft: `${toPx(1)} solid rgb(226, 226, 226)`
    }
};

export interface ISiteCategoryItemProps {
    slot: string;
    categoryItemComponentMinWidth?: number;
    type?: string;
}

class SiteCategoryItem extends React.Component<ISiteCategoryItemProps & IManagedClasses<ISiteCategoryItemManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.siteCategoryItem}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(SiteCategoryItem);
