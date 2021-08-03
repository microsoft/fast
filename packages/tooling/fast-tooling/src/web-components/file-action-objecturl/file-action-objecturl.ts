import { FileAction } from "../file-action/";

/**
 * Implementation of a FileAction that converts files into Object URLs.
 */
export class FileActionObjectUrl extends FileAction {
    public performFileAction(
        files: FileList,
        completedCallback: (fileReferences: string[]) => void,
        progressCallback?: (progress: number) => Promise<void>
    ): void {
        this._files = files;
        this._fileReferences = [];

        // Loop through each file
        Array.from(files).forEach((value: File) => {
            // Convert file to an object URL
            this._fileReferences.push(URL.createObjectURL(value));

            // Call progress callback if supplied.
            if (progressCallback) {
                progressCallback(this.fileReferences.length / this.files.length);
            }
        });

        // Call completed callback
        completedCallback(this.fileReferences);
    }
}
