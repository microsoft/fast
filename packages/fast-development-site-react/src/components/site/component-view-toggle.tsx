import * as React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { Link, withRouter } from "react-router-dom";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";
import devSiteDesignSystemDefaults, { DevSiteDesignSystem } from "../design-system";

export interface ComponentViewToggleClassNameContract {
    componentViewToggle: string;
}
const styles: ComponentStyles<
    ComponentViewToggleClassNameContract,
    DevSiteDesignSystem
> = {
    componentViewToggle: {
        width: "30px",
        height: "30px",
        display: "flex",
        position: "relative",
        alignItems: "center",
        border: "1px solid transparent",
        justifyContent: "center",
        margin: toPx(2),
        fill: (config: DevSiteDesignSystem): string => {
            return config.foreground300 || devSiteDesignSystemDefaults.foreground300;
        },
        borderRadius: "2px",
        boxSizing: "border-box",
        '&[aria-current="page"]': {
            "&::before": {
                content: "''",
                position: "absolute",
                display: "block",
                background: (config: DevSiteDesignSystem): string => {
                    return config.brandColor || devSiteDesignSystemDefaults.brandColor;
                },
                width: "24px",
                left: "2px",
                bottom: "-1px",
                borderRadius: "2px 2px 0 0",
                height: "2px",
            },
        },
        "&:hover": {
            cursor: "pointer",
            background: "rgba(0, 0, 0, 0.04)",
        },
        "&:focus": {
            outline: "none",
            border: (config: DevSiteDesignSystem): string => {
                return `1px solid ${config.brandColor ||
                    devSiteDesignSystemDefaults.brandColor}`;
            },
        },
    },
};

export interface ComponentViewToggleProps {
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

class ComponentViewToggle extends React.Component<
    ComponentViewToggleProps & ManagedClasses<ComponentViewToggleClassNameContract>,
    {}
> {
    public render(): JSX.Element {
        return (
            <Link
                className={this.props.managedClasses.componentViewToggle}
                to={this.props.to}
                onClick={this.props.onClick}
                aria-label={this.props.label}
                aria-current={this.props.current ? "page" : null}
            >
                <span dangerouslySetInnerHTML={{ __html: this.props.glyph }} />
            </Link>
        );
    }
}

export default manageJss(styles)(ComponentViewToggle);
