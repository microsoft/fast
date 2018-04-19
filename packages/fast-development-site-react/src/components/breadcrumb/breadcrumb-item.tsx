import * as React from "react";
import { Link } from "react-router-dom";
import { IDevSiteDesignSystem } from "../design-system";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface IBreadcrumbItemProps {
    to: string;
}

export interface IBreadcrumbItemManagedClasses {
    breadcrumb_listItem: string;
}

const style: ComponentStyles<IBreadcrumbItemManagedClasses, IDevSiteDesignSystem> = {
    breadcrumb_listItem: {
        "paddingRight": "12px",
        "display": "inline",
        "&::after": {
            content: "'\\002F'",
            padding: `0 0 0 10px`,
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
                <li className={this.props.managedClasses.breadcrumb_listItem}>
                    <Link to={this.props.to}>
                        {this.props.children}
                    </Link>
                </li>
            );
        } else {
            return (
                <li className={this.props.managedClasses.breadcrumb_listItem}>
                    <span>
                        {this.props.children}
                    </span>
                </li>
            );
        }
    }
}

export default manageJss(style)(BreadcrumbItem);
