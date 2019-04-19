import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { AppShellClassNamesContract } from "./app-shell.styles";

export type AppShellManagedClasses = ManagedClasses<AppShellClassNamesContract>;
/**
 * Defines the configuration for a single application registered to the app-shell
 */
export interface AppShellApp {
    /**
     * The name of the application
     */
    name: string;

    /**
     * The id of the app - this must be unique for each registered app
     */
    id: string;

    /**
     * The SVG icon to be used in the navigation pane
     */
    icon: React.ReactElement<React.ReactSVGElement>;

    /**
     * The root path of the application. If no root path is provided
     */
    rootPath: string;

    /**
     * Function to render the application
     */
    render: () => React.ReactNode;
}

export enum AppShellColorModes {
    light = "light",
    dark = "dark",
}

export interface AppShellProps extends AppShellManagedClasses {
    /**
     * The applications registered with the shell
     */
    apps: AppShellApp[];

    /**
     * The mode of the shell - either light or dark
     */
    colorMode?: AppShellColorModes;
}
