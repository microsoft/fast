import * as React from "react";
import { Link } from "react-router-dom";
import { IDevSiteDesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface IBreadcrumbItemProps {
    to: string;
}

export interface IBreadcrumbItemManagedClasses {
    breadcrumbItem_listItem: string;
}

const style: ComponentStyles<IBreadcrumbItemManagedClasses, IDevSiteDesignSystem> = {
    breadcrumbItem_listItem: {
        "paddingRight": toPx(12),
        "display": "inline",
        "&::after": {
            content: "'\\002F'",
            padding: `0 0 0 ${toPx(10)}`,
            color: (config: IDevSiteDesignSystem): string => config.foregroundColor
        },
        "&:last-child": {
            "&::after": {
                content: "''"
            }
        }
    }
};

class BreadcrumbItem extends React.Component<IBreadcrumbItemProps & IManagedClasses<IBreadcrumbItemManagedClasses>, {}> {

    public render(): JSX.Element {
        if (this.props.to) {
            return (
                <li className={this.props.managedClasses.breadcrumbItem_listItem}>
                    <Link to={this.props.to}>
                        {this.props.children}
                    </Link>
                </li>
            );
        } else {
            return (
                <li className={this.props.managedClasses.breadcrumbItem_listItem}>
                    <span>
                        {this.props.children}
                    </span>
                </li>
            );
        }
    }
}

export default manageJss(style)(BreadcrumbItem);
