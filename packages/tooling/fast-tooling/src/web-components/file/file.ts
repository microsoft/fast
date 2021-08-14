import { attr, observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { FileAction } from "../file-action/";
import { FormAssociatedFile } from "./file.form-associated";

/**
 * Web component for presenting a file picker dialog and perform some action on the selected files.
 * The component expects a FileAction component as a child which performs the action.
 * Example:
 *   <fast-tooling-file
 *       accept=".jpg,.jpeg,.gif,.png"
 *       @change=${x=>x.myChangeHandler}
 *   >
 *       Add image
 *       <fast-tooling-file-action-objecturl role="fileaction" slot="action"></fast-tooling-file-action-objecturl>
 *   </fast-tooling-file>
 */
export class File extends FormAssociatedFile {
    /**
     * Reference to the FileAction that will be performed when files are selected.
     */
    private fileAction: FileAction;

    /**
     * The list of file types that will be shown in the file picker.
     * Matches syntax for the "accept" attribute of the <file type="file"/> element.
     */
    @attr
    public accept: string;

    /**
     * When true the file picker will allow the selection of multiple files.
     * By default only one file is allowed.
     */
    @attr
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

    /**
     * Slot reference for actions slot. When children are added to the slot it searches for the first
     * control with the role="fileaction". Additional actions are ignored.
     */
    @observable
    public action: HTMLSlotElement;
    private actionChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.fileAction = Array.from(this.children).find(
                this.isFileAction
            ) as FileAction;
        }
    }

    /**
     * Fast Element lifecycle hook
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.proxy.onchange = e => {
            this.handleChange(e);
        };
    }

    /**
     * Click handler for the button. Sets up the proxy element and triggers the click event
     * in order to open the system file picker dialog.
     */
    public handleClick(): void {
        this.proxy.accept = this.accept;
        this.proxy.multiple = this.multiple;
        this.proxy.click();
    }

    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    public handleChange(e: Event): void {
        if (this.fileAction) {
            const files: FileList = (e.composedPath()[0] as HTMLInputElement).files;
            this.fileAction.performFileAction(
                files,
                (values: string[]) => {
                    this.fileReferences = values;
                    this.$emit("change");
                },
                this.progressCallback
            );
        }
    }

    /**
     * Determines if a given element is a FileAction web component.
     * @param el - The element to test.
     * @returns - True if the element is a FileAction.
     */
    private isFileAction(el: Element): el is HTMLElement {
        return isHTMLElement(el) && (el.getAttribute("role") as string) === "fileaction";
    }
}
