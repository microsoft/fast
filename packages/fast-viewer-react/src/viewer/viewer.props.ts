import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ViewerClassNameContract } from "./viewer.class-name-contract";

export enum ResizeHandleLocation {
    left,
    right,
    bottom,
    bottomLeft,
    bottomRight,
}

export interface ComponentMappedToId {
    /**
     * The React component
     */
    component: any;

    /**
     * The id that will be used as an identifier
     * for the React component
     */
    id: string;
}

export interface ViewerManagedClasses extends ManagedClasses<ViewerClassNameContract> {}
export interface ViewerUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ViewerHandledProps extends ViewerManagedClasses {
    /**
     * The src route for the viewer iframe
     */
    iframeSrc: string;

    /**
     * The props to be assigned to the viewer content
     */
    viewerContentProps?: any;

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
}

export type ViewerProps = ViewerUnhandledProps & ViewerHandledProps;
