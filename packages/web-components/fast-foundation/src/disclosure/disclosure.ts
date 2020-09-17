import { attr, FASTElement } from "@microsoft/fast-element";
/**
 * A Disclosure Custom HTML Element.
 * Based largely on the {@link https://w3c.github.io/aria-practices/#disclosure | disclosure element }.
 *
 * @public
 */
export class Disclosure extends FASTElement {
    /**
     * Determines if the element should show the extra content or not.
     *
     */
    @attr({ mode: "boolean" })
    public expanded: boolean;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.setupComponent();
    }

    constructor() {
        super();
        this.expanded = false;
    }

    /**
     * Show extra content.
     */
    public show(): void {
        if (!this.expanded) {
            this.expanded = true;
            this.update();
        }
    }

    /**
     * Hide extra content.
     */
    public hide(): void {
        if (this.expanded) {
            this.expanded = false;
            this.update();
        }
    }

    /**
     * Toggle the current(expanded/closed) state.
     */
    public toggle(): void {
        this.expanded = !this.expanded;
        this.update();
    }

    protected get contentHeight(): number {
        const size = this.contentNode.getBoundingClientRect().height;
        return size;
    }

    /**
     * Show animation implementation in sub-classer.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected async showAnimation({ contentNode }) {}

    /**
     * Hide animation implementation in sub-classer.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected async hideAnimation({ contentNode }) {}

    protected get contentNode(): HTMLElement {
        return Array.from(this.children).find(
            child => child.slot === "content"
        ) as HTMLElement;
    }

    private get invokerNode(): HTMLElement {
        return Array.from(this.children).find(
            child => child.slot === "invoker"
        ) as HTMLElement;
    }

    /**
     * Toggle extra content visibility on state change.
     */
    private async updateContentSize() {
        if (this.expanded) {
            this.toggleContentNode();
            await this.showAnimation({ contentNode: this.contentNode });
        } else {
            await this.hideAnimation({ contentNode: this.contentNode });
            this.toggleContentNode();
        }
    }

    /**
     * Set default state for content based on `expanded` attr
     */
    private setDefaultState(): void {
        if (!this.expanded) {
            this.toggleContentNode();
        }
    }

    /**
     * Update content slot size and fire `expanded-changed` event
     */
    private update(): void {
        this.updateContentSize();
        this.invokerNode.setAttribute("aria-expanded", `${this.expanded}`);
        this.$emit("expanded-changed");
    }

    /**
     * Set all required attributes for the component's invoker and content node.
     */
    private setupComponent(): void {
        if (this.invokerNode && this.contentNode) {
            const uid = this.uuid();
            this.invokerNode.addEventListener("click", this.toggle.bind(this));
            this.setDefaultState();
            this.invokerNode.setAttribute("aria-expanded", `${this.expanded}`);
            this.invokerNode.setAttribute("id", `disclosure-invoker-${uid}`);
            this.invokerNode.setAttribute("aria-controls", `disclosure-content-${uid}`);
            this.contentNode.setAttribute("aria-labelledby", `disclosure-invoker-${uid}`);
            this.contentNode.setAttribute("id", `disclosure-content-${uid}`);
            this.update();
        }
    }

    /**
     * Toggle content node based on the component state.
     */
    private toggleContentNode(): void {
        this.contentNode.style.setProperty("display", this.expanded ? "" : "none");
    }

    /**
     * Generate random UUID
     */
    private uuid = () => Math.random().toString(36).substr(2, 10);
}
