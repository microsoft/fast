import * as React from "react";
import { uniqueId } from "lodash-es";
import { FormItemComponentMappingToProperyNamesProps } from "./form-item";

export interface FormItemFileUploadState {
    /**
     * If the file-upload is being dragged over
     */
    dragging: boolean;

    /**
     * If the file-upload is currently processing an upload
     */
    processing: boolean;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemFileUpload extends React.Component<
    FormItemComponentMappingToProperyNamesProps,
    FormItemFileUploadState
> {
    /**
     * The id of the file input
     */
    public fileId: string;

    /**
     * File reader to handle reading / parsing of file data
     */
    private reader: FileReader = new FileReader();

    constructor(props: FormItemComponentMappingToProperyNamesProps) {
        super(props);

        this.fileId = uniqueId();
        this.state = {
            dragging: false,
            processing: false
        };
    }

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div>
                <label htmlFor={this.fileId}>{this.props.label}</label>
                <div
                    onDragEnter={this.cancelEvent}
                    onDragOver={this.dragOver}
                    onDragLeave={this.dragLeave}
                    onDrop={this.onDrop}
                >
                    {this.state.processing
                        ? this.generateProcessingUI()
                        : this.generateStaticUI()}
                </div>
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidMount(): void {
        this.reader.addEventListener("load", this.handleReaderLoad);
    }

    /**
     * React lifecycle hook
     */
    public componentWillUnMount(): void {
        this.reader.removeEventListener("load", this.handleReaderLoad);
    }

    /**
     * Callback to call when the reader loads file data
     */
    private handleReaderLoad = (): void => {
        this.setState({ processing: false });
        this.props.onChange(this.props.dataLocation, this.reader.result);
    };

    /**
     * Event handler that effectively cancels the event
     */
    private cancelEvent = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    /**
     * Updates the component with new file data
     */
    private updateWithFile(file: File): void {
        // We should exit if file is not actually a File or the type is not an image
        if (!(file instanceof File) || !file.type.includes("image")) {
            return;
        }

        this.setState({ processing: true });
        this.reader.readAsDataURL(file);
    }

    /**
     * Event handler for drag-area dragover event
     */
    private dragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        this.cancelEvent(e);

        if (!this.state.dragging) {
            this.setState({ dragging: true });
        }
    };

    /**
     * Event handler for drag-area drag-leave event
     */
    private dragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        this.cancelEvent(e);
        this.setState({ dragging: false });
    };

    /**
     * Callback for drop event
     */
    private onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        this.cancelEvent(e);
        this.setState({ dragging: false });
        this.updateWithFile(e.dataTransfer.files[0]);
    };

    /**
     * Callback for input change
     */
    private handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.updateWithFile(e.target.files[0]);
    };

    private generateStaticUI(): JSX.Element[] {
        return [
            typeof this.props.data === "string" ? (
                <img key="thumbnail" src={this.props.data} alt="Image upload thumbnail" />
            ) : null,
            <input
                key="input"
                type="file"
                id={this.fileId}
                onChange={this.handleInputOnChange}
            />,
            <p key="info">
                Drag your asset here or{" "}
                <label htmlFor={this.fileId}>browse your files.</label>
            </p>
        ];
    }

    private generateProcessingUI(): JSX.Element {
        return <p>Uploading...</p>;
    }
}

export default FormItemFileUpload;
