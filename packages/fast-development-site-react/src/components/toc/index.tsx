import * as React from "react";
import { IDevSiteDesignSystem } from "../design-system";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import TocItem from "./toc-item";
import TocMenu from "./toc-menu";

export interface ITocProps {
    id: string;
    ariaHidden: boolean;
}

export interface ITocManagedClasses {
    toc: string;
}

const style: ComponentStyles<ITocManagedClasses, IDevSiteDesignSystem> = {
    toc: {
        margin: "0",
        padding: "0",
        fontSize: toPx(14),
        "&[aria-hidden='true']": {
            display: "none"
        }
    }
};

class Toc extends React.Component<ITocProps & IManagedClasses<ITocManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <ul id={this.props.id} className={this.props.managedClasses.toc} aria-hidden={this.props.ariaHidden}>
                {this.props.children}
            </ul>
        );
    }
}

export default manageJss(style)(Toc);
export { TocItem, TocMenu };
