import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { FileUploadControlClassNameContract } from "./control.file-upload.style";
import { uniqueId } from "lodash-es";
import {
    FileUploadControlProps,
    FileUploadControlState,
} from "./control.file-upload.props";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Custom form control definition
 */
class FileUploadControl extends React.Component<
    FileUploadControlProps & ManagedClasses<FileUploadControlClassNameContract>,
    FileUploadControlState
> {
    public static displayName: string = "FileUploadControl";

    public static defaultProps: Partial<
        FileUploadControlProps & ManagedClasses<FileUploadControlClassNameContract>
    > = {
        managedClasses: {},
    };

    /**
     * The id of the file input
     */
    public fileId: string;

    /**
     * File reader to handle reading / parsing of file data
     */
    private reader: FileReader = new FileReader();

    constructor(props: FileUploadControlProps) {
        super(props);

        this.fileId = uniqueId();
        this.state = {
            dragging: false,
            processing: false,
        };
    }

    /**
     * Render the component
     */
    public render(): React.ReactNode {
        return (
            <div
                className={classNames(this.props.managedClasses.fileUploadControl, [
                    this.props.managedClasses.fileUploadControl__disabled,
                    this.props.disabled,
                ])}
                onDragEnter={this.cancelEvent}
                onDragOver={this.dragOver}
                onDragLeave={this.dragLeave}
                onDrop={this.onDrop}
            >
                {this.state.processing
                    ? this.generateProcessingUI()
                    : this.generateStaticUI()}
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
        this.props.onChange({ value: this.reader.result });
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

    private generateStaticUI(): React.ReactNode {
        return [
            typeof this.props.value === "string" ? (
                <img
                    key={"thumbnail"}
                    src={this.props.value}
                    alt={"Image upload thumbnail"}
                />
            ) : null,
            <input
                key={"input"}
                className={this.props.managedClasses.fileUploadControl_input}
                type={"file"}
                id={this.fileId}
                onChange={this.handleInputOnChange}
            />,
            <p key={"info"}>
                Drag your asset here or{" "}
                <label htmlFor={this.fileId}>browse your files.</label>
            </p>,
        ];
    }

    private generateProcessingUI(): JSX.Element {
        return <p>Uploading...</p>;
    }
}

export { FileUploadControl };
export default manageJss(styles)(FileUploadControl);
