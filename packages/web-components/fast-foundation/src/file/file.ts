import { attr, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedFile } from "./file.form-associated";

/**
 * File configuration options
 * @public
 */
export type FileOptions = FoundationElementDefinition & {
    fileList?: string | SyntheticViewTemplate;
    controlElement?: string | SyntheticViewTemplate;
};

/**
 * A File Custom HTML Element.
 * A file input is a control that is used to give a user the ability to select files from their computer's file system.
 *
 * @public
 */
export class FileSelect extends FormAssociatedFile {
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
    public files: FileList | any;

    /**
     * When true the file picker will allow the selection of multiple files.
     * @public
     * @remarks
     * HTML Attribute: multiple
     */
    @attr({ mode: "boolean" })
    public multiple: boolean;

    /**
     * Determines the file list display mode.
     * @public
     * @remarks
     * HTML Attribute: multiple
     */
    @attr({ mode: "boolean" })
    public preview: boolean;

    /**
     * After file(s) are selected this property will contain a string array with the their filenames
     */
    @observable
    public fileListBuffer: any[] = [];

    @observable
    public fileSelectorControl: HTMLSlotElement;

    @observable
    public listItems: Element[];

    /**
     * Fast Element lifecycle hook
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.onchange = e => {
            this.handleChange();
        };
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.files = [];
        this.fileListBuffer = [];
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
        this.proxy.click();
    }

    public handleChange(): void {
        this.files = this.proxy.files;

        this.files.forEach((value: File) => {
            if (this.preview) {
                this.fileListBuffer.push(URL.createObjectURL(value));
            } else {
                this.fileListBuffer.push(value.name);
            }
        });
    }
}
