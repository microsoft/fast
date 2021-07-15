import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { FileUploadControlClassNameContract } from "./control.file-upload.style";
import {
    FileUploadControlProps,
    FileUploadControlState,
} from "./control.file-upload.props";
/**
 * Custom form control definition
 */
declare class FileUploadControl extends React.Component<
    FileUploadControlProps & ManagedClasses<FileUploadControlClassNameContract>,
    FileUploadControlState
> {
    static displayName: string;
    static defaultProps: Partial<
        FileUploadControlProps & ManagedClasses<FileUploadControlClassNameContract>
    >;
    /**
     * The id of the file input
     */
    fileId: string;
    /**
     * File reader to handle reading / parsing of file data
     */
    private reader;
    constructor(props: FileUploadControlProps);
    /**
     * Render the component
     */
    render(): React.ReactNode;
    /**
     * React lifecycle hook
     */
    componentDidMount(): void;
    /**
     * React lifecycle hook
     */
    componentWillUnMount(): void;
    /**
     * Callback to call when the reader loads file data
     */
    private handleReaderLoad;
    /**
     * Event handler that effectively cancels the event
     */
    private cancelEvent;
    /**
     * Updates the component with new file data
     */
    private updateWithFile;
    /**
     * Event handler for drag-area dragover event
     */
    private dragOver;
    /**
     * Event handler for drag-area drag-leave event
     */
    private dragLeave;
    /**
     * Callback for drop event
     */
    private onDrop;
    /**
     * Callback for input change
     */
    private handleInputOnChange;
    private generateStaticUI;
    private generateProcessingUI;
}
export { FileUploadControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, FileUploadControlClassNameContract, {}>,
    any
>;
export default _default;
