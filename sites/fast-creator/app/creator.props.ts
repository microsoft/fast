import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Direction } from "@microsoft/fast-web-utilities";
import { DataDictionary } from "@microsoft/fast-tooling";
import { StandardLuminance } from "@microsoft/fast-components";
import { DisplayMode } from "./utilities/shared";

export enum FormId {
    component,
    designSystem,
}

export enum NavigationId {
    navigation,
    libraries,
}

/**
 * Data for a single view
 */
export interface ProjectFileView {
    dataDictionary: DataDictionary<unknown>;
}

/**
 * A project file is a culmination of all views which should contain the data for that view
 */
export interface ProjectFile {
    /**
     * The accent color
     */
    accentColor: string;

    /**
     * The direction of the viewer
     */
    direction: Direction;

    /**
     * The creator theme
     */
    theme: StandardLuminance;

    /**
     * The active dictionaryId to show
     */
    activeDictionaryId: string;

    /**
     * The x position in the preview
     */
    xCoord: number;

    /**
     * The y position in the preview
     */
    yCoord: number;

    /**
     * The width of the preview
     */
    viewerWidth: number;

    /**
     * The height of the preview
     */
    viewerHeight: number;

    /**
     * The selected device for the preview
     */
    deviceId: string;

    /**
     * Dev tools visible
     */
    devToolsVisible: boolean;

    /**
     * Show data navigation
     */
    mobileNavigationVisible: boolean;

    /**
     * Show form
     */
    mobileFormVisible: boolean;

    /**
     * The active navigation id for the left pane
     */
    activeNavigationId: NavigationId;

    /**
     * Libraries that have been added to the project
     */
    addedLibraries: string[];

    /**
     * The active form id for the right pane
     */
    activeFormId: FormId;

    /**
     * The dictionary of design system data
     */
    designSystemDataDictionary: DataDictionary<unknown>;

    /**
     * The dictionary of data
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * Preview background transparency
     */
    transparentBackground: boolean;

    /**
     * The last mapped data dictionary to monaco editor value
     */
    lastMappedDataDictionaryToMonacoEditorHTMLValue: string;

    /**
     * The display mode
     */
    displayMode: DisplayMode;
}

export type CreatorManagedClasses = ManagedClasses<{}>;

export interface CreatorState extends ProjectFile {
    /**
     * The preview is ready state
     */
    previewReady: boolean;
}
