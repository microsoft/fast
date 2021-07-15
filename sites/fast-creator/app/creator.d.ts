import React from "react";
import { Editor } from "@microsoft/site-utilities";
import { CreatorState } from "./creator.props";
export declare const previewAccentColor: string;
export declare const defaultElementDataId: string;
declare class Creator extends Editor<{}, CreatorState> {
    static displayName: string;
    viewerContainerRef: React.RefObject<HTMLDivElement>;
    editorContainerRef: React.RefObject<HTMLDivElement>;
    private windowResizing;
    private devices;
    private linkedDataControl;
    private handleDimensionChange;
    constructor(props: {});
    render(): React.ReactNode;
    private handleNavigationVisibility;
    private handleFormVisibility;
    private handleAddLibrary;
    private handleLibraryAdded;
    private handleAddLinkedData;
    private handleMessageSystem;
    private handleDesignSystemMessageSystem;
    private handleWindowMessage;
    private handleUpdateProjectFile;
    private handleWindowResize;
    componentDidMount(): void;
    private updateMonacoEditor;
    private getDevices;
    private getDeviceById;
    private handleUpdateDevice;
    private handleUpdateOrientation;
    private setResponsiveDeviceId;
    onUpdateHeight: (viewerHeight: number) => void;
    onUpdateWidth: (viewerWidth: number) => void;
    private updateDesignSystemDataDictionaryState;
    /**
     * Event handler for accent color input changes
     */
    private handleAccentColorPickerChange;
    /**
     * Event handler for theme changes
     */
    handleUpdateTheme: () => void;
    /**
     * Event handler for direction changes
     */
    handleUpdateDirection: () => void;
    /**
     * Handle the visibility of the dev tools
     * which contains the code editor
     */
    private handleDevToolsToggle;
    /**
     * Handle the preview mode switch change event
     * @param newState - The new state of the switch
     */
    private handlePreviewModeSwitch;
}
export default Creator;
