import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface IComponentViewToggleClassNameContract {
    componentViewToggle: string;
}
const styles: ComponentStyles<IComponentViewToggleClassNameContract, IDevSiteDesignSystem> = {
    componentViewToggle: {
        width: "40px",
        height: "40px",
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        "&[aria-current=\"page\"]": {
            "&:before": {
                content: "''",
                position: "absolute",
                display: "block",
                width: "32px",
                left: "4px",
                bottom: "0px",
                height: "2px",
                background: (config: IDevSiteDesignSystem) => {
                    return config.brandColor;
                }
            }
        }
    }
};

export interface IComponentViewToggleProps {
    /**
     * The URL of the anchor
     */
    to: string;

    /**
     * onClick callback
     */
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;

    /**
     * The accessible label for the toggle
     */
    label: string;

    /**
     * If the label is the current path
     */
    current: boolean;

    /**
     * The glyph to create
     */
    glyph: string;
}

class ComponentViewToggle extends React.Component<IComponentViewToggleProps & IManagedClasses<IComponentViewToggleClassNameContract>, {}> {

    public render(): JSX.Element {
        return (
            <Link
                className={this.props.managedClasses.componentViewToggle}
                to={this.props.to}
                onClick={this.props.onClick}
                aria-label={this.props.label}
                aria-current={this.props.current ? "page" : null}
            >
                <span dangerouslySetInnerHTML={{__html: this.props.glyph}} />
            </Link>
        );
    }
}

export default manageJss(styles)(ComponentViewToggle);
