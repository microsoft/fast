import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ExplorerClassNameContract } from "./explorer.style";
import { Direction } from "@microsoft/fast-web-utilities";

/**
 * The properties of a component
 */
export interface ComponentProps {
    id: string;
    props: any;
}

/**
 * The view config
 */
export interface ViewConfig {
    direction: Direction;
}

/**
 * A project file is a culmination of all views which should contain the data for that view
 */
export interface ProjectFile {
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
     * The scenario
     */
    scenario: ComponentProps;

    /**
     * The configuration for the view
     */
    viewConfig: ViewConfig;
}

export interface ExplorerManagedClasses
    extends ManagedClasses<ExplorerClassNameContract> {}

export interface ExplorerHandledProps extends ExplorerManagedClasses {}

export interface ExplorerProps extends ExplorerHandledProps {}

export interface ExplorerState extends ProjectFile {}
