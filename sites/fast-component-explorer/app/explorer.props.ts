import { Direction } from "@microsoft/fast-web-utilities";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { DataDictionary } from "@microsoft/fast-tooling";
import { EditorState } from "@microsoft/site-utilities";
import { ComponentViewConfig } from "./fast-components/configs/data.props";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ExplorerProps {}

export interface ExplorerState extends EditorState {
    /**
     * The current location path based on route
     */
    locationPathname: string;

    /**
     * The width of the preview
     */
    viewerWidth: number;

    /**
     * The height of the preview
     */
    viewerHeight: number;

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
     * The theme
     */
    theme: StandardLuminance;

    /**
     * Whether the preview is available
     */
    previewReady: boolean;

    /**
     * The active dictionary ID
     */
    activeDictionaryId: string;

    /**
     * The current data dictionary
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The active pivot tab
     */
    activePivotTab: string;

    /**
     * The visibility of the mobile navigation pane
     */
    mobileNavigationVisible: boolean;

    /**
     * The visibility of the mobile form pane
     */
    mobileFormVisible: boolean;
}
