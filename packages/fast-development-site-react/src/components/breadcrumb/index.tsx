import * as React from "react";
import { DevSiteDesignSystem } from "../design-system";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps
} from "@microsoft/fast-jss-manager-react";
import BreadcrumbItem from "./breadcrumb-item";

/* tslint:disable-next-line */
export interface BreadcrumbProps {}

export interface BreadcrumbManagedClasses {
    breadcrumb: string;
    breadcrumb_list: string;
}

const style: ComponentStyles<BreadcrumbManagedClasses, DevSiteDesignSystem> = {
    breadcrumb: {},
    breadcrumb_list: {
        margin: "0",
        padding: "0"
    }
};

class Breadcrumb extends React.Component<
    BreadcrumbProps & ManagedClasses<BreadcrumbManagedClasses>,
    {}
> {
    public render(): JSX.Element {
        return (
            <nav className={this.props.managedClasses.breadcrumb}>
                <ul className={this.props.managedClasses.breadcrumb_list}>
                    {this.props.children}
                </ul>
            </nav>
        );
    }
}

export default manageJss(style)(Breadcrumb);
export { BreadcrumbItem };
