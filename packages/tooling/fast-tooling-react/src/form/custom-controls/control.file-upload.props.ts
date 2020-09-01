import { CommonControlConfig } from "../templates";

export interface FileUploadControlState {
    /**
     * If the file-upload is being dragged over
     */
    dragging: boolean;

    /**
     * If the file-upload is currently processing an upload
     */
    processing: boolean;
}

export type FileUploadControlProps = CommonControlConfig;
