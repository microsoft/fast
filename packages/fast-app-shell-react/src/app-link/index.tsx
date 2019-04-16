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

export interface DasbhoardLinkClassNameContract {
    dashboardLink: string;
    dasboardLink__active: string;
}

export interface AppLinkProps {
    href: string;
    children: React.ReactNode;
}

const styles: ComponentStyles<DasbhoardLinkClassNameContract, DesignSystem> = {
    dashboardLink: {
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
    dasboardLink__active: {
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
    (
        props: AppLinkProps & ManagedClasses<DasbhoardLinkClassNameContract>
    ): JSX.Element => {
        return (
            <NavLink
                to={props.href}
                children={props.children}
                className={get(props.managedClasses, "dashboardLink")}
                activeClassName={get(props.managedClasses, "dasboardLink__active")}
            />
        );
    }
);
