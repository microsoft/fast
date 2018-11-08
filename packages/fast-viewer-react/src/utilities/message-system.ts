export interface ComponentData {
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
    initializeComponent = "initialize-component",

    /**
     * Update a components data
     */
    updateComponentData = "update-component-data",
}

export enum ViewerMessageTarget {
    /**
     * Target the parent viewer
     */
    viewer = "viewer",

    /**
     * Target the iframe contents ViewerContent component
     */
    viewerContent = "viewer-content",
}

export interface ViewerMessage {
    /**
     * The target of the message
     */
    target: ViewerMessageTarget;

    /**
     * The message type
     */
    type: ViewerMessageType;

    /**
     * The component data
     */
    componentData?: ComponentData[];
}
