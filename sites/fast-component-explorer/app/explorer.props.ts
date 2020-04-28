import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ExplorerClassNameContract } from "./explorer.style";
import { ComponentViewConfig } from "./utilities/configs/data.props";

export type ExplorerUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface ExplorerHandledProps {
    managedClasses: ExplorerClassNameContract;
}

export type ExplorerProps = ExplorerHandledProps & ExplorerUnhandledProps;

export interface Theme {
    id: string;
    displayName: string;
    background?: string;
}

export enum ThemeName {
    dark = "dark",
    light = "light",
}

export interface ExplorerState {
    /**
     * The current location path based on route
     */
    locationPathname: string;

    /**
     * The width of the preview
     */
    width: number;

    /**
     * The height of the preview
     */
    height: number;

    /**
     * The selected component
     */
    componentName: string;

    /**
     * The selected components schema ID
     */
    componentConfig: ComponentViewConfig;

    /**
     * The selected scenario index
     */
    selectedScenarioIndex: number;

    /**
     * Viewer design system
     */
    designSystem: DesignSystem;

    /**
     * Viewer has transparent background
     */
    transparentBackground: boolean;

    /**
     * The explorer theme
     */
    theme: ThemeName;

    /**
     * Dev tools visible
     */
    devToolsVisible: boolean;
}
