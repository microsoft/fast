import * as React from "react";
import { DevSiteDesignSystem } from "../design-system";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import TocItem from "./toc-item";
import TocMenu from "./toc-menu";

export interface TocProps {
    id: string;
    ariaHidden: boolean;
}

export interface TocManagedClasses {
    toc: string;
}

const style: ComponentStyles<TocManagedClasses, DevSiteDesignSystem> = {
    toc: {
        margin: "0",
        padding: "0",
        fontSize: toPx(14),
        "&[aria-hidden='true']": {
            display: "none",
        },
    },
};

class Toc extends React.Component<TocProps & ManagedClasses<TocManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <ul
                id={this.props.id}
                className={this.props.managedClasses.toc}
                aria-hidden={this.props.ariaHidden}
            >
                {this.props.children}
            </ul>
        );
    }
}

export default manageJss(style)(Toc);
export { TocItem, TocMenu };
