import { FoundationElement } from "@microsoft/fast-foundation";

export abstract class FileAction extends FoundationElement {
    protected _files: FileList;
    protected _fileReferences: string[];

    get files() {
        return this._files;
    }
    get fileReferences() {
        return this._fileReferences;
    }

    /**
     * Interface definition of method for performing actions on a FileList
     * @param files - The FileList of files to perform the action on
     * @param completedCallback - Callback for when file processing is complete
     * @param progressCallback - Optional progress callback
     * @returns Array of strings representing the files
     */
    public abstract performFileAction(
        files: FileList,
        completedCallback: (fileReferences: string[]) => void,
        progressCallback?: (progress: number) => void
    ): void;
}
