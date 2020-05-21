import { DesignSystem, StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { Direction } from "@microsoft/fast-web-utilities";
import { ExplorerClassNameContract } from "./explorer.style";
import { ComponentViewConfig } from "./fast-components/configs/data.props";

export type ExplorerUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface ExplorerHandledProps {
    managedClasses: ExplorerClassNameContract;
}

export type ExplorerProps = ExplorerHandledProps & ExplorerUnhandledProps;

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
     * Viewer has transparent background
     */
    transparentBackground: boolean;

    /**
     * Dev tools visible
     */
    devToolsVisible: boolean;

    /**
     * The direction
     */
    direction: Direction;

    /**
     * Whether the preview is available
     */
    previewReady: boolean;

    /**
     * The active dictionary ID
     */
    activeDictionaryId: string;
}
