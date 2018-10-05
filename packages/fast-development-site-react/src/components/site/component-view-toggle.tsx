import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { Link, withRouter } from "react-router-dom";
import manageJss, { ComponentStyles, IManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";

export interface IComponentViewToggleClassNameContract {
    componentViewToggle: string;
}
const styles: ComponentStyles<IComponentViewToggleClassNameContract, IDevSiteDesignSystem> = {
    componentViewToggle: {
        width: toPx(40),
        height: toPx(38),
        display: "flex",
        position: "relative",
        alignItems: "center",
        border: `${toPx(1)} solid transparent`,
        justifyContent: "center",
        borderRadius: toPx(2),
        margin: toPx(2),
        "&[aria-current=\"page\"]": {
            "&::before": {
                content: "''",
                position: "absolute",
                display: "block",
                width: toPx(32),
                left: toPx(4),
                bottom: toPx(-1),
                borderRadius: `${toPx(2)} ${toPx(2)} 0 0`,
                height: toPx(2),
                background: (config: IDevSiteDesignSystem): string => config.brandColor
            }
        },
        "&:hover": {
            cursor: "pointer",
            background: "rgba(0, 0, 0, 0.04)"
        },
        "&:focus": {
            outline: "none",
            border: (config: IDevSiteDesignSystem): string => {
                return `${toPx(1)} solid ${config.brandColor || devSiteDesignSystemDefaults.brandColor}`;
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
