import * as React from "react";
import { IDevSiteDesignSystem } from "../design-system";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import BreadcrumbItem from "./breadcrumb-item";

/* tslint:disable-next-line */
export interface IBreadcrumbProps { }

export interface IBreadcrumbManagedClasses {
    breadcrumb: string;
    breadcrumb__list: string;
}

const style: ComponentStyles<IBreadcrumbManagedClasses, IDevSiteDesignSystem> = {
    breadcrumb: {
    },
    breadcrumb__list: {
        margin: "0",
        padding: "0"
    }
};

class Breadcrumb extends React.Component<IBreadcrumbProps & IManagedClasses<IBreadcrumbManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <nav className={this.props.managedClasses.breadcrumb}>
                <ul className={this.props.managedClasses.breadcrumb__list}>
                    {this.props.children}
                </ul>
            </nav>
        );
    }
}

export default manageJss(style)(Breadcrumb);
export { BreadcrumbItem };
