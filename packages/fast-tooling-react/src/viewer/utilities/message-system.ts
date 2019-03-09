export interface ComponentProps {
    /**
     * The id mapped to the component
     */
    id: string;

    /**
     * The props for the component
     */
    props: any;
}

export enum ViewerMessageType {
    /**
     * Initialize a component
     */
    initialize = "@microsoft/fast-tooling-react/initialize-component",

    /**
     * Update a components props
     */
    updateProps = "@microsoft/fast-tooling-react/update-component-props",
}

export enum ViewerMessageTarget {
    /**
     * Target the parent viewer
     */
    viewer = "@microsoft/fast-tooling-react/viewer",

    /**
     * Target the iframe contents ViewerContent component
     */
    viewerContent = "@microsoft/fast-tooling-react/viewer-content",
}

export interface ComponentViewerMessage {
    /**
     * The target of the message
     */
    target: ViewerMessageTarget;

    /**
     * The message type
     */
    type: ViewerMessageType;

    /**
     * The component props
     */
    props?: ComponentProps[];
}

/**
 * This is a custom message to be sent via postMessage
 * and will be stringified and sent to the iframe.
 */
export type CustomViewerMessage = any;

export type ViewerMessage = ComponentViewerMessage | CustomViewerMessage;
