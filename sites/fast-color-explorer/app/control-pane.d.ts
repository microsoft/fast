import { ColorRGBA64 } from "@microsoft/fast-colors";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { ColorsDesignSystem } from "./design-system";
import { ComponentTypes } from "./state";
export interface ControlPaneClassNameContract {
    controlPane: string;
    controlPane_accentShortcutContainer: string;
    controlPane_accentShortcut: string;
    controlPane_accentShortcut__selected: string;
}
export interface ControlPaneProps extends ManagedClasses<ControlPaneClassNameContract> {
    componentType: ComponentTypes;
    designSystem: ColorsDesignSystem;
    setComponentType: (value: string) => any;
    setNeutralBaseColor: (value: ColorRGBA64) => any;
    setAccentBaseColor: (value: ColorRGBA64) => any;
    setShowOnlyRecommendedBackgrounds: (value: boolean) => any;
    showOnlyRecommendedBackgrounds: boolean;
}
export interface ControlPaneState {
    accentColorBase: string;
    neutralColorBase: string;
}
declare const ControlPane: import("react-redux").ConnectedComponentClass<
    React.ComponentClass<
        import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
            ControlPaneProps,
            any,
            ColorsDesignSystem
        >,
        any
    >,
    Pick<
        import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
            ControlPaneProps,
            any,
            ColorsDesignSystem
        >,
        "jssStyleSheet" | "innerRef"
    >
>;
declare type ControlPane = InstanceType<typeof ControlPane>;
export { ControlPane };
