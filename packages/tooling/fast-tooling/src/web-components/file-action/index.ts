import { FoundationElement } from "@microsoft/fast-foundation";

/**
 * Abstract base class for FileAction components for use with the File Component.
 * When creating a new FileAction base the new action on this class and override
 * the performFileAction method.
 * The performFileAction implementation should process the given FileList as neccessary
 * calling the progressCallback method (if provided) with a value between 0 and 1
 * indicating the current progress if the process is long running.
 * When processing is complete performFileAction must call the completedCallback method
 * passing a string array containing the list file references (i.e. file names, object URLs,
 * http urls, etc) depending on the purpose of the FileAction.
 */
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
     * @returns void
     */
    public abstract performFileAction(
        files: FileList,
        completedCallback: (fileReferences: string[]) => void,
        progressCallback?: (progress: number) => Promise<void>
    ): void;
}
