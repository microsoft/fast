import * as React from "react";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteCategoryItemManagedClasses {
    category_item: string;
    category_item__component: string;
}

const style: ComponentStyles<ISiteCategoryItemManagedClasses, IDevSiteDesignSystem> = {
    category_item: {
        display: "flex",
        flexWrap: "wrap",
        margin: "24px",
        borderTop: "1px solid rgb(226, 226, 226)",
        borderLeft: "1px solid rgb(226, 226, 226)"
    },
    category_item__component: {
        flexGrow: "1",
        flexBasis: "0",
        padding: "12px",
        minWidth: (config: IDevSiteDesignSystem): string => {
            return `${config.categoryItemComponentMinWidth}px`;
        },
        borderBottom: "1px solid rgb(226, 226, 226)",
        borderRight: "1px solid rgb(226, 226, 226)"
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
            <div className={this.props.managedClasses.category_item}>
                {this.props.children}
            </div>
        );
    }
}

export default manageJss(style)(SiteCategoryItem);
