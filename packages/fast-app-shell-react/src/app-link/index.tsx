import React from "react";
import manageJss, {
    ComponentStyles,
    ManagedClasses,
} from "@microsoft/fast-jss-manager-react";
import {
    accentFillRest,
    cornerRadius,
    DesignSystem,
    DesignSystemResolver,
    designUnit,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import { NavLink } from "react-router-dom";
import { get } from "lodash-es";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";

export interface AppLinkClassNameContract {
    appLink: string;
    appLink__active: string;
}

export interface AppLinkProps {
    href: string;
    title: string;
    children: React.ReactNode;
}

const styles: ComponentStyles<AppLinkClassNameContract, DesignSystem> = {
    appLink: {
        position: "relative",
        display: "flex",
        width: toPx(multiply(designUnit, 10)),
        height: toPx(multiply(designUnit, 10)),
        alignItems: "center",
        justifyContent: "center",
        background: neutralFillStealthRest,
        transition: "all .05s ease-out",
        "& svg": {
            stroke: neutralForegroundRest,
        },
        "&:hover": {
            background: neutralFillStealthHover,
        },
        "&:active": {
            background: neutralFillStealthActive,
        },
    },
    appLink__active: {
        "&::before": {
            position: "absolute",
            top: "8px",
            left: "4px",
            content: "''",
            height: "24px",
            width: "2px",
            borderRadius: toPx(cornerRadius),
            background: accentFillRest,
        },
    },
};

export default manageJss(styles)(
    (props: AppLinkProps & ManagedClasses<AppLinkClassNameContract>): JSX.Element => {
        return (
            <NavLink
                to={props.href}
                children={props.children}
                className={get(props.managedClasses, "appLink")}
                activeClassName={get(props.managedClasses, "appLink__active")}
                aria-label={props.title}
            />
        );
    }
);
