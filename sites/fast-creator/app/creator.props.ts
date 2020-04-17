import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Direction } from "@microsoft/fast-web-utilities";
import { DataDictionary, LinkedData } from "@microsoft/fast-tooling";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { CreatorClassNameContract } from "./creator.style";
import { LinkedDataStack } from "./msft-components/example-data";

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
     * The active view
     */
    activeView: string;

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
    width: number;

    /**
     * The height of the preview
     */
    height: number;

    /**
     * The selected device for the preview
     */
    deviceId: string;

    /**
     * The views
     */
    views: {
        [key: string]: ProjectFileView;
    };

    /**
     * The stack of linked data that needs to be resolved
     * Note: This should be null when it's used as a project file
     */
    linkedDataStack: LinkedDataStack[] | null;

    /**
     * The ditionary ids that correspond to the linked data
     * Note: This should be null when it's used as a project file
     */
    linkedDataIdsForStack: LinkedData[] | null;
}

export type CreatorManagedClasses = ManagedClasses<CreatorClassNameContract>;

export type CreatorHandledProps = CreatorManagedClasses;

export type CreatorProps = CreatorHandledProps;

export type CreatorState = ProjectFile;
