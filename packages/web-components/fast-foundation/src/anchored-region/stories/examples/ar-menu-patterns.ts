import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
    ref,
    when,
} from "@microsoft/fast-element";

export function registerARMenuPatterns() {
    ARMenuPatterns.define({
        name: "ar-menu-patterns",
        template: arMenuPatternsTemplate(),
        styles: arMenuPatternsStyles,
    });
}

/**
 *
 *
 * @public
 */
export class ARMenuPatterns extends FASTElement {
    @observable
    basicDropdownOpen: boolean = false;

    @observable
    sideDropdownOpen: boolean = false;

    @observable
    basicDropdownDynamicOpen: boolean = false;

    @observable
    sideDropdownDynamicOpen: boolean = false;

    @observable
    basicDropdownFillOpen: boolean = false;

    @observable
    sideDropdownFillOpen: boolean = false;

    @observable
    fixedDropDownOpen: boolean = false;

    @observable
    absoluteDropDownOpen: boolean = false;

    @observable
    contextMenuOpen: boolean = false;

    @observable
    virtualAnchorX: number = 0;

    @observable
    virtualAnchorY: number = 0;

    public contextElement: HTMLElement;

    public connectedCallback(): void {
        super.connectedCallback();
        this.contextElement.addEventListener("contextmenu", this.handleContext);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.contextElement.removeEventListener("contextmenu", this.handleContext);
    }

    public handleContext = (e: MouseEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.virtualAnchorX = e.clientX;
        this.virtualAnchorY = e.clientY;
        if (!this.contextMenuOpen) {
            this.contextMenuOpen = true;
            window.addEventListener("click", this.handleContextClose);
        }
    };

    public handleContextClose = (e: MouseEvent): void => {
        if (e.defaultPrevented) {
            return;
        }
        window.removeEventListener("click", this.handleContextClose);
        this.contextMenuOpen = false;
    };
}

const contextMenuTemplate = html`
    <fast-menu style="width: 100%; overflow-y: auto; max-height:100vh;">
        <fast-menu-item>Option 1</fast-menu-item>
        <fast-menu-item>Option 2</fast-menu-item>
        <fast-menu-item>Option 3</fast-menu-item>
        <fast-menu-item>Option 4</fast-menu-item>
        <fast-menu-item>Option 5</fast-menu-item>
        <fast-menu-item>Option 6</fast-menu-item>
        <fast-menu-item>Option 7</fast-menu-item>
        <fast-menu-item>Option 8</fast-menu-item>
        <fast-menu-item>Option 9</fast-menu-item>
        <fast-menu-item>Option 10</fast-menu-item>
        <fast-menu-item>Option 11</fast-menu-item>
        <fast-menu-item>
            Option 12
            <fast-menu slot="submenu">
                <fast-menu-item>Option 1</fast-menu-item>
                <fast-menu-item>Option 2</fast-menu-item>
                <fast-menu-item>Option 3</fast-menu-item>
                <fast-menu-item>Option 4</fast-menu-item>
                <fast-menu-item>Option 5</fast-menu-item>
                <fast-menu-item>
                Option 6
                <fast-menu slot="submenu">
                    <fast-menu-item>Option 1</fast-menu-item>
                    <fast-menu-item>Option 2</fast-menu-item>
                    <fast-menu-item>Option 3</fast-menu-item>
                    <fast-menu-item>Option 4</fast-menu-item>
                    <fast-menu-item>Option 5</fast-menu-item>
                    <fast-menu-item>
                        Option 6
                    </fast-menu-item>
                </fast-menu>
                </fast-menu-item>
            </fast-menu>
        </fast-menu-item>
    </fast-listmenu>
`;

const listboxTemplate = html`
    <fast-listbox style="width: 100%; overflow-y: auto;">
        <fast-option>Option 1</fast-option>
        <fast-option>Option 2</fast-option>
        <fast-option>Option 3</fast-option>
        <fast-option>Option 4</fast-option>
        <fast-option>Option 5</fast-option>
        <fast-option>Option 6</fast-option>
        <fast-option>Option 7</fast-option>
        <fast-option>Option 8</fast-option>
        <fast-option>Option 9</fast-option>
        <fast-option>Option 10</fast-option>
        <fast-option>Option 11</fast-option>
        <fast-option>Option 12</fast-option>
    </fast-listbox>
`;
const sectionDividerTemplate = html`
    <fast-divider style="margin:20px;"></fast-divider>
`;

/**
 * The template
 * @public
 */
export function arMenuPatternsTemplate<T extends ARMenuPatterns>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <template style="">
            <h1>
                Menu patterns
            </h1>
            ${sectionDividerTemplate} The most basic flyouts always appear in the same
            relative position to their anchor and ignore the viewport (ie. they don't care
            if they get clipped). ${sectionDividerTemplate}

            <fast-button
                id="anchor-basic-dropdown"
                @click="${x => (x.basicDropdownOpen = !x.basicDropdownOpen)}"
            >
                Basic dropdown menu
            </fast-button>
            ${when(
                x => x.basicDropdownOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-basic-dropdown"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}

            <fast-button
                id="anchor-side-dropdown"
                @click="${x => (x.sideDropdownOpen = !x.sideDropdownOpen)}"
            >
                Side dropdown menu
            </fast-button>
            ${when(
                x => x.sideDropdownOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-side-dropdown"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-inset="true"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}
            ${sectionDividerTemplate} By taking advantage of dynamic positioning modes
            flyouts can choose positions with the most room. If the viewport gets resized
            the flyouts go to where there is the most room. ${sectionDividerTemplate}

            <fast-button
                id="anchor-basic-dropdown-dynamic"
                @click="${x =>
                    (x.basicDropdownDynamicOpen = !x.basicDropdownDynamicOpen)}"
            >
                Dynamic vertical menu
            </fast-button>
            ${when(
                x => x.basicDropdownDynamicOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-basic-dropdown-dynamic"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="dynamic"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}

            <fast-button
                id="anchor-side-dropdown-dynamic"
                @click="${x => (x.sideDropdownDynamicOpen = !x.sideDropdownDynamicOpen)}"
            >
                Dynamic side menu
            </fast-button>
            ${when(
                x => x.sideDropdownDynamicOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-side-dropdown-dynamic"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-inset="true"
                        vertical-positioning-mode="dynamic"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}
            ${sectionDividerTemplate} In cases where there is not enough room in the
            viewport for the flyout to fully display the "fill" scaling option can be used
            to respond to viewport size. These examples scale the listbox rather than
            change positions (these behaviors could also be combined).
            ${sectionDividerTemplate}

            <fast-button
                id="anchor-basic-dropdown-fill"
                @click="${x => (x.basicDropdownFillOpen = !x.basicDropdownFillOpen)}"
            >
                Scaling vertical menu
            </fast-button>
            ${when(
                x => x.basicDropdownFillOpen,
                html<T>`
                    <fast-anchored-region
                        style="display:flex; flex-direction: column;"
                        anchor="anchor-basic-dropdown-fill"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}

            <fast-button
                id="anchor-side-dropdown-fill"
                @click="${x => (x.sideDropdownFillOpen = !x.sideDropdownFillOpen)}"
            >
                Scaling side menu
            </fast-button>
            ${when(
                x => x.sideDropdownFillOpen,
                html<T>`
                    <fast-anchored-region
                        style="display:flex; flex-direction: column;"
                        anchor="anchor-side-dropdown-fill"
                        auto-update-mode="auto"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-inset="true"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="fill"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}
            ${sectionDividerTemplate} Popups have their css position attribute set to
            either "fixed" or "absolute" based on the value of the component's
            "fixed-placement" attribute. Authors may choose either but there are
            tradeoffs. Elements that are "fixed" may be more effective at escaping
            containers, but "absolute" positioned elements may track better during
            scrolling (ie. no corrections are necessary if the element is actually
            scrolling with the parent container). ${sectionDividerTemplate}
            <fast-button
                id="anchor-fixed-dropdown"
                @click="${x => (x.fixedDropDownOpen = !x.fixedDropDownOpen)}"
            >
                Fixed position dropdown
            </fast-button>
            ${when(
                x => x.fixedDropDownOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-fixed-dropdown"
                        fixed-placement="true"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}

            <fast-button
                id="anchor-absolute-dropdown"
                @click="${x => (x.absoluteDropDownOpen = !x.absoluteDropDownOpen)}"
            >
                Absolute positioned dropdown
            </fast-button>
            ${when(
                x => x.absoluteDropDownOpen,
                html<T>`
                    <fast-anchored-region
                        anchor="anchor-absolute-dropdown"
                        auto-update-mode="auto"
                        horizontal-default-position="center"
                        horizontal-positioning-mode="locktodefault"
                        horizontal-scaling="anchor"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="locktodefault"
                        vertical-scaling="content"
                    >
                        ${listboxTemplate}
                    </fast-anchored-region>
                `
            )}
            ${sectionDividerTemplate} Context menus can be positioned using a point as an
            anchor rather than an element. The context menu below also uses viewport lock
            and a css constraint on not exceeding the viewport height to remain is
            view.${sectionDividerTemplate}
            <div
                style="background:green; height:400px; width:400px; padding: 20px;"
                ${ref("contextElement")}
            >
                I have a context menu!
            </div>
            ${when(
                x => x.contextMenuOpen,
                html<T>`
                    <fast-anchored-region
                        use-virtual-anchor="true"
                        fixed-placement="true"
                        horizontal-default-position="right"
                        horizontal-positioning-mode="dynamic"
                        horizontal-scaling="content"
                        horizontal-viewport-lock="true"
                        vertical-default-position="bottom"
                        vertical-positioning-mode="dynamic"
                        vertical-viewport-lock="true"
                        :virtualAnchorX="${x => x.virtualAnchorX}"
                        :virtualAnchorY="${x => x.virtualAnchorY}"
                    >
                        ${contextMenuTemplate}
                    </fast-anchored-region>
                `
            )}
        </template>
    `;
}

export const arMenuPatternsStyles = css`
    :host {
        display: block;
    }
`;
