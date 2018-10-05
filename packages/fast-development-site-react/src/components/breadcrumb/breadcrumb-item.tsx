import * as React from "react";
import { Link } from "react-router-dom";
import { DevSiteDesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";

export interface BreadcrumbItemProps {
    to: string;
}

export interface BreadcrumbItemManagedClasses {
    breadcrumbItem_listItem: string;
}

const style: ComponentStyles<BreadcrumbItemManagedClasses, DevSiteDesignSystem> = {
    breadcrumbItem_listItem: {
        "paddingRight": toPx(12),
        "display": "inline",
        "&::after": {
            content: "'\\002F'",
            padding: `0 0 0 ${toPx(10)}`,
            color: (config: DevSiteDesignSystem): string => config.foregroundColor
        },
        "&:last-child": {
            "&::after": {
                content: "''"
            }
        }
    }
};

class BreadcrumbItem extends React.Component<BreadcrumbItemProps & ManagedClasses<BreadcrumbItemManagedClasses>, {}> {

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
