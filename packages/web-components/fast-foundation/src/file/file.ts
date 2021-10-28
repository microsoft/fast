import { attr, observable } from "@microsoft/fast-element";
import { FormAssociatedFile } from "./file.form-associated";

/**
 * A File Custom HTML Element.
 * A file input is a control that is used to give a user the ability to select files from their computer's file system.
 *
 * @public
 */
export class File extends FormAssociatedFile {
    /**
     * One or more unique file type specifiers describing file types to allow.
     * @public
     * @remarks
     * HTML Attribute: accept
     */
    @attr
    public accept: string;

    /**
     * What source to use for capturing image or video data (`user` or `environment`)
     * @public
     * @remarks
     * HTML Attribute: accept
     */
    @attr
    public capture: string;

    /**
     * A `DOMString` that represents the path to the selected file(s). If the user selected multiple files, the value represents the first file in the list of files they selected
     * @public
     * @remarks
     * HTML Attrubute: value
     */
    @attr
    public value: string;

    /**
     * A `FileList` listing the chosen files
     * @public
     * @remarks
     * HTML Attribute: files
     */
    @attr
    public files: any;

    /**
     * When true the file picker will allow the selection of multiple files.
     * @public
     * @remarks
     * HTML Attribute: multiple
     */
    @attr({ mode: "boolean" })
    public multiple: boolean;

    /**
     * Callback method for reporting progress of long running FileAction.
     * The progress value is calculated by the FileAction but should be a number between 0 and 1.
     */
    @attr
    public progressCallback: (progress: number) => Promise<void>;

    /**
     * After file(s) are selected this property will contain a string array with the references
     * to the selected files based on the action (i.e. file name, objectUrl, http url, base64 blob, etc).
     */
    @observable
    public fileReferences: string[] = [];

    @observable
    public fileSelectorButton: HTMLSlotElement;

    /**
     * Fast Element lifecycle hook
     */
    public connectedCallback(): void {
        super.connectedCallback();
        console.log(this.fileReferences);
        this.proxy.onchange = e => {
            this.handleChange(e);
        };
    }

    /**
     * Click handler for the button. Sets up the proxy element and triggers the click event
     * in order to open the system file picker dialog.
     * @param e - the mouse event
     * @internal
     *
     */
    public handleClick(): void {
        this.proxy.accept = this.accept;
        this.proxy.multiple = this.multiple;
        this.proxy.value = this.value;
        this.proxy.files = this.files;
        this.proxy.click();
    }

    public handleChange(e: Event): void {
        this.files = (e.composedPath()[0] as HTMLInputElement).files;
        this.getFileList();
    }

    private getFileList(): void {
        Array.from(this.files).forEach((value: File) => {
            this.fileReferences.push(URL.createObjectURL(value));
        });
    }
}
