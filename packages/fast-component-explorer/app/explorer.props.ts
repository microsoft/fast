import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ExplorerClassNameContract } from "./explorer.style";
import { Direction } from "@microsoft/fast-web-utilities";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

/**
 * The properties of a component
 */
export interface ComponentProps<T> {
    id: string;
    props: T;
}

/**
 * The view config
 */
/* tslint:disable-next-line */
export interface ViewConfig extends DesignSystem {}

/* tslint:disable-next-line */
export interface ExplorerManagedClasses
    extends ManagedClasses<ExplorerClassNameContract> {}

/* tslint:disable-next-line */
export interface ExplorerHandledProps extends ExplorerManagedClasses {}

/* tslint:disable-next-line */
export interface ExplorerProps extends ExplorerHandledProps {}

export interface Theme {
    id: string;
    displayName: string;
    background?: string;
}

export enum ThemeName {
    dark = "dark",
    light = "light",
}

/* tslint:disable-next-line */
export interface ExplorerState {
    /**
     * The current data location
     */
    dataLocation: string;

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
     * The scenario
     */
    scenario: ComponentProps<unknown> | void;

    /**
     * The configuration for the view
     */
    viewConfig: ViewConfig;

    /**
     * The explorer theme
     */
    theme: ThemeName;

    /**
     * Dev tools visible
     */
    devToolsVisible: boolean;
}
