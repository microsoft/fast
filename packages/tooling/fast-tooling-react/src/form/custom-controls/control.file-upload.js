import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.file-upload.style";
import { uniqueId } from "lodash-es";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Custom form control definition
 */
class FileUploadControl extends React.Component {
    constructor(props) {
        super(props);
        /**
         * File reader to handle reading / parsing of file data
         */
        this.reader = new FileReader();
        /**
         * Callback to call when the reader loads file data
         */
        this.handleReaderLoad = () => {
            this.setState({ processing: false });
            this.props.onChange({ value: this.reader.result });
        };
        /**
         * Event handler that effectively cancels the event
         */
        this.cancelEvent = e => {
            e.preventDefault();
        };
        /**
         * Event handler for drag-area dragover event
         */
        this.dragOver = e => {
            this.cancelEvent(e);
            if (!this.state.dragging) {
                this.setState({ dragging: true });
            }
        };
        /**
         * Event handler for drag-area drag-leave event
         */
        this.dragLeave = e => {
            this.cancelEvent(e);
            this.setState({ dragging: false });
        };
        /**
         * Callback for drop event
         */
        this.onDrop = e => {
            this.cancelEvent(e);
            this.setState({ dragging: false });
            this.updateWithFile(e.dataTransfer.files[0]);
        };
        /**
         * Callback for input change
         */
        this.handleInputOnChange = e => {
            this.updateWithFile(e.target.files[0]);
        };
        this.fileId = uniqueId();
        this.state = {
            dragging: false,
            processing: false,
        };
    }
    /**
     * Render the component
     */
    render() {
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
    componentDidMount() {
        this.reader.addEventListener("load", this.handleReaderLoad);
    }
    /**
     * React lifecycle hook
     */
    componentWillUnMount() {
        this.reader.removeEventListener("load", this.handleReaderLoad);
    }
    /**
     * Updates the component with new file data
     */
    updateWithFile(file) {
        // We should exit if file is not actually a File or the type is not an image
        if (!(file instanceof File) || !file.type.includes("image")) {
            return;
        }
        this.setState({ processing: true });
        this.reader.readAsDataURL(file);
    }
    generateStaticUI() {
        return [
            typeof this.props.value === "string" ? (
                <img
                    key={"thumbnail"}
                    src={this.props.value}
                    alt={this.props.strings.fileUploadPreviewAlt}
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
                {this.props.strings.fileUploadDragInstr}{" "}
                <label htmlFor={this.fileId}>
                    {this.props.strings.fileUploadBrowseFiles}
                </label>
            </p>,
        ];
    }
    generateProcessingUI() {
        return <p>{this.props.strings.fileUploadUploading}</p>;
    }
}
FileUploadControl.displayName = "FileUploadControl";
FileUploadControl.defaultProps = {
    managedClasses: {},
};
export { FileUploadControl };
export default manageJss(styles)(FileUploadControl);
