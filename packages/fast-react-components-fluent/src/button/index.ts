import * as React from "react";
import { Button, IButtonProps, IButtonManagedClasses } from "@microsoft/fast-react-components-base";
import manageJss, { ComponentStyles } from "@microsoft/fast-react-jss-manager";
import {IFluentDesignSystem} from "../design-system";
function applyBackplate(): any {
    return {
        backgroundColor: (config: IFluentDesignSystem): string => {
            return config.controlBackplateColorSecondary;
        },
        borderRadius: (config: IFluentDesignSystem): string => {
            return config.controlBackplateRadius + "px";
        },
        border: (config: IFluentDesignSystem): string => {
            return config.controlBorderSize + "px " + config.controlBorderStyle + " " + config.controlBorderColor;
        },
        lineHeight: (config: IFluentDesignSystem): string => {
            // The formula below vertically adjusts the text to compensate for the border.
            return config.controlHeight - (config.controlBorderSize * 2) + "px";
        },
        color: (config: IFluentDesignSystem): string => {
            return config.controlBackplateTextColor;
        }
    };
}

const styles: ComponentStyles<IButtonManagedClasses, IFluentDesignSystem> = {
    button: {
// Controls: all
        "height": (config: IFluentDesignSystem): string => {
            // Control height should be based on a function that sets the proper limits such as 20, 24, 28, 32, 36, 40, and 44.
            return config.controlHeight + "px";
        },
        "font-size": (config: IFluentDesignSystem): string => {
            return config.controlTextSize + "px";
        },
        "transition": (config: IFluentDesignSystem): string => {
            return config.controlBackplateTransition;
        },
        "display": "inline-block",
        "outline": "none",
        "overflow": "hidden",
        "whiteSpace": "nowrap",
        // TODO: Add a way to change the margin.
        "marginTop": "12px",
// Controls: with backplates
        ...applyBackplate(),
        // "backgroundColor": (config: IFluentDesignSystem): string => {
        //     return config.controlBackplateColorSecondary;
        // },
        // "borderRadius": (config: IFluentDesignSystem): string => {
        //     return config.color + "px";
        // },
        // "border": (config: IFluentDesignSystem): string => {
        //     return config.controlBorderSize + "px " + config.controlBorderStyle + " " + config.controlBorderColor;
        // },
        // "lineHeight": (config: IFluentDesignSystem): string => {
        //     // The formula below vertically adjusts the text to compensate for the border.
        //     return config.controlHeight - (config.controlBorderSize * 2) + "px";
        // },
        // "color": (config: IFluentDesignSystem): string => {
        //     return config.controlBackplateTextColor;
        // },
// Control: Controls with variable content.
        "padding": (config: IFluentDesignSystem): string => {
            return "0px " + config.controlTextPaddingHorizontal + "px";
        },
        "textAlign": "center",
        // Reset: Can remove when it is part of the reset.
        "boxSizing": "border-box",
        "&:hover": {
 // Controls: with backplates on hover
           // TODO: Colors for states like Hover, Focus, and Active should be generated from a function.
            background: "rgba(0,0,0,.3)",
            // We should create a function for the fluent elevation system.
            boxShadow: "0 4px 9px rgba(0, 0, 0, 0.15), 0 0.75px 2.25px rgba(0, 0, 0, 0.08)",
            transitionProperty: "box-shadow, transform",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.29, 0.99)",       },
         "&:focus": {
 // Controls: with backplates on focus
           // TODO: Colors for states like Hover, Focus, and Active should be generated from a function.
            background: "rgba(0,0,0,.3)",
            borderColor: "rgba(0,0,0,.4)",
        },
        "&:active": {
// Controls: with backplates on active
            // TODO: Colors for states like Hover, Focus, and Active should be generated from a function.
            background: "rgba(0,0,0,.2)",
            borderColor: "rgba(0,0,0,.1)",
            // We should create a function for the fluent elevation system.
            boxShadow: "0 2px 4.5px rgba(0, 0, 0, 0.15), 0 0.375px 1.125px rgba(0, 0, 0, 0.08)",
            transitionProperty: "box-shadow, transform",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.29, 0.99)",
        },
    },
};

export default manageJss(styles)(Button);
