import { attr, DOM, observable, ViewTemplate } from "@microsoft/fast-element";
import { eventFocusIn, eventFocusOut } from "@microsoft/fast-web-utilities";
import { createEditor, IEditor } from "roosterjs";
import { FoundationElement } from "../foundation-element";
import {
    AnchoredRegion,
    AnchoredRegionConfig,
    FlyoutPosBottom,
    FlyoutPosTallest,
    FlyoutPosTop,
} from "../anchored-region";
import type { TextEditorToolbar } from "./text-editor-toolbar";

/**
 * Defines the vertical positioning options for an anchored region
 *
 * @beta
 */
export type toolbarPlacement = "bottom" | "tallest" | "top";

/**
 * A text editor Custom HTML Element.
 *
 * @public
 */
export class TextEditor extends FoundationElement {
    /**
     * Controls menu placement
     *
     * @public
     * @remarks
     * HTML Attribute: menu-placement
     */
    @attr({ attribute: "toolbar-placement" })
    public toolbarPlacement: toolbarPlacement = "tallest";
    private toolbarPlacementChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateToolbarConfig();
        }
    }

    /**
     * Sets the template to use to generate the toolbar.
     * Set the the text editor.
     *
     * @public
     */
    @observable
    public toolbarTemplate: ViewTemplate<TextEditorToolbar>;
    private toolbarTemplateChanged(): void {
        if (this.$fastController.isConnected && this.toolbarElement) {
            this.toolbarElement.toolbarTemplate = this.toolbarTemplate;
        }
    }

    /**
     * Sets the template to use to generate the toolbar.
     * Set the the text editor.
     *
     * @public
     */
    @observable
    public toolbarResources: object;
    private toolbarResourcesChanged(): void {
        if (this.$fastController.isConnected && this.toolbarElement) {
            this.toolbarElement.resources = this.toolbarResources;
        }
    }

    /**
     *  Controls toolbar visibility
     *
     * @internal
     */
    @observable
    public showToolbar: boolean = false;
    private showToolbarChanged(): void {
        if (this.showToolbar) {
            DOM.queueUpdate(this.setRegionProps);
            this.$emit("toolbaropening");
        } else {
            this.$emit("toolbarclosing");
        }
    }

    /**
     *  The anchored region config to apply.
     *
     * @internal
     */
    @observable
    public toolbarConfig: AnchoredRegionConfig;

    /**
     * reference to the anchored region element
     *
     * @internal
     */
    public region: AnchoredRegion;

    /**
     * The tag for the text editor toolbar element (ie. "fast-text-editor-toolbar" vs. "fluent-text-editor-toolbar")
     *
     * @internal
     */
    @observable
    public toolbarTag: string;

    /**
     * reference to the editor host div
     *
     * @internal
     */
    public editorHost: HTMLDivElement;

    private editor: IEditor | undefined;
    private toolbarElement: TextEditorToolbar | undefined;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.editorHost = document.createElement("div");
        this.editorHost.slot = "editor-region";
        this.editorHost.setAttribute("role", "textbox");
        this.editorHost.tabIndex = 0;
        this.appendChild(this.editorHost);
        this.editor = createEditor(this.editorHost);
        this.addEventListener(eventFocusIn, this.handleFocusIn);
        this.addEventListener(eventFocusOut, this.handleFocusOut);

        this.updateToolbarConfig();

        this.toolbarElement = document.createElement(
            this.toolbarTag
        ) as TextEditorToolbar;
        this.toolbarElement.editor = this.editor;
        this.toolbarElement.toolbarTemplate = this.toolbarTemplate;
        if (this.toolbarResources) {
            this.toolbarElement.resources = this.toolbarResources;
        }
        this.appendChild(this.toolbarElement);
    }

    /**
     * @internal
     */
    public disconnectedCallback() {
        this.editor = undefined;
        this.toolbarElement = undefined;
        this.removeEventListener(eventFocusIn, this.handleFocusIn);
        this.removeEventListener(eventFocusOut, this.handleFocusOut);
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public handleFocusIn(e: FocusEvent): void {
        this.showToolbar = true;
    }

    /**
     * @internal
     */
    public handleFocusOut(e: FocusEvent): void {
        this.showToolbar = false;
    }

    /**
     * Anchored region is loaded
     *
     * @internal
     */
    public handleRegionLoaded(e: Event): void {
        DOM.queueUpdate(() => {
            this.$emit("toolbarloaded", { bubbles: false });
        });
    }

    /**
     * Sets properties on the anchored region once it is instanciated.
     */
    private setRegionProps = (): void => {
        if (!this.showToolbar) {
            return;
        }
        if (this.region === null || this.region === undefined) {
            DOM.queueUpdate(this.setRegionProps);
            return;
        }
        this.region.anchorElement = this.editorHost;
    };

    /**
     * Updates the toolbar config
     */
    private updateToolbarConfig(): void {
        let newConfig = this.configLookup[this.toolbarPlacement];

        if (newConfig === null) {
            newConfig = FlyoutPosBottom;
        }

        this.toolbarConfig = {
            ...newConfig,
            autoUpdateMode: "auto",
            fixedPlacement: true,
            horizontalViewportLock: false,
            verticalViewportLock: false,
        };
    }

    /**
     * matches menu placement values with the associated menu config
     */
    private configLookup: object = {
        top: FlyoutPosTop,
        bottom: FlyoutPosBottom,
        tallest: FlyoutPosTallest,
    };
}
