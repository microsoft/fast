import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ViewerClassNameContract } from "./viewer.class-name-contract";
import { MessageSystem } from "@microsoft/fast-tooling";

export enum ResizeHandleLocation {
    left,
    right,
    bottom,
    bottomLeft,
    bottomRight,
}

export interface ViewerManagedClasses extends ManagedClasses<ViewerClassNameContract> {}
export interface ViewerUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ViewerHandledProps extends ViewerManagedClasses {
    /**
     * The src route for the viewer iframe
     */
    iframeSrc: string;

    /**
     * The responsive, resizable functionality for the viewer
     */
    responsive?: boolean;

    /**
     * The height of the viewer
     */
    height?: number;

    /**
     * The width of the viewer
     */
    width?: number;

    /**
     * A callback for when height should update
     */
    onUpdateHeight?: (height: number) => void;

    /**
     * A callback for when width should update
     */
    onUpdateWidth?: (width: number) => void;

    /**
     * The message system
     * used for sending and receiving data to the message system
     */
    messageSystem: MessageSystem;
}

export type ViewerProps = ViewerUnhandledProps & ViewerHandledProps;
