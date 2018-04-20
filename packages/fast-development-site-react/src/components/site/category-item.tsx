import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteCategoryItemManagedClasses {
    categoryItem: string;
}

const style: ComponentStyles<ISiteCategoryItemManagedClasses, IDevSiteDesignSystem> = {
    categoryItem: {
        display: "flex",
        flexWrap: "wrap",
        margin: "24px",
        borderTop: "1px solid rgb(226, 226, 226)",
        borderLeft: "1px solid rgb(226, 226, 226)"
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
            <div className={this.props.managedClasses.categoryItem}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(SiteCategoryItem);
