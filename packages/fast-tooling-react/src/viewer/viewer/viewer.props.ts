import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ViewerClassNameContract } from "./viewer.class-name-contract";
import { CustomViewerMessage, ViewerMessage } from "../utilities/message-system";

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
     * The props to be assigned to the ViewerContent component
     */
    viewerContentProps?: any;

    /**
     * Custom message to pass to the iframe
     */
    iframePostMessage?: CustomViewerMessage;

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
     * A callback for when content props have been requested to be updated
     */
    onUpdateContentProps?: (message: ViewerMessage) => void;

    /**
     * A callback for when content props are requested to be initialized
     */
    onInitializeContentProps?: (message: ViewerMessage) => void;
}

export type ViewerProps = ViewerUnhandledProps & ViewerHandledProps;
