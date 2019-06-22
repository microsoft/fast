import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ExplorerClassNameContract } from "./explorer.style";
import { Orientation } from "@microsoft/fast-tooling-react";

/**
 * The properties of a component
 */
export interface ComponentProps {
    id: string;
    props: any;
}

/**
 * Data for a single view
 */
export interface ProjectFileView {
    data: ComponentProps;
}

/**
 * A project file is a culmination of all views which should contain the data for that view
 */
export interface ProjectFile {
    /**
     * The active view
     */
    activeView: string;

    /**
     * The current data location
     */
    dataLocation: string;

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
     * The view orientation
     */
    orientation: Orientation;

    /**
     * The views
     */
    views: {
        [key: string]: ProjectFileView;
    };
}

export interface ExplorerManagedClasses
    extends ManagedClasses<ExplorerClassNameContract> {}

export interface ExplorerHandledProps extends ExplorerManagedClasses {}

export interface ExplorerProps extends ExplorerHandledProps {}

export interface ExplorerState extends ProjectFile {}
