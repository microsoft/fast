import { attr, DOM, observable } from "@microsoft/fast-element";
import { isHTMLElement, isNullOrWhiteSpace } from "@microsoft/fast-web-utilities";
import { times } from "lodash-es";
import { FileAction } from "../file-action/file-action";
import { FormAssociatedFile } from "./file.form-associated";

export class File extends FormAssociatedFile {

    private fileAction: FileAction;

    @attr
    public accept:string = "";

    @attr
    public multiple:boolean = false;

    @observable
    public fileReferences: string[];

    @observable
    public action: HTMLSlotElement;
    private actionChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            if (this.children.length > 0) {
                 Array.from(this.children).every((value: FileAction) => {
                     if (this.isFileAction(value)) {
                         this.fileAction = value;
                         return false;
                     }
                     return true;
                 });
            }
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.proxy.onchange = (e)=>{this.handleChange(e);};
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
        if(this.fileAction)
        {
            const files:FileList = (e.composedPath()[0] as HTMLInputElement).files;
            this.fileAction.performFileAction(files, (values:string[])=>{
                this.fileReferences = values;
                this.$emit("change");
            });
        }
    }
    
    public handleClick(): void {
        this.proxy.accept = this.accept;
        this.proxy.multiple = this.multiple;
        this.proxy.click();
    }

    private isFileAction(el: Element): el is HTMLElement {
        return (
            isHTMLElement(el) && (el.getAttribute("role") as string) === "fileaction"
        );
    }

}