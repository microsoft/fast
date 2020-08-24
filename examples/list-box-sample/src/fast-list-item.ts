import {
    FASTElement,
    customElement,
    html,
    attr,
    css,
    observable,
} from "@microsoft/fast-element";

const template = html<FASTListItem>`
    <template role="option" aria-selected=${x => x.selected} @click="${x => x.select()}">
        <slot></slot>
    </template>
`;

const styles = css`
    :host {
        display: block;
        cursor: pointer;
    }

    :host(:hover) {
        background: rgba(200, 200, 200, 0.25);
    }

    :host([selected]) {
        background: rgba(0, 182, 255, 0.5);
    }
`;

@customElement({
    name: "fast-list-item",
    template,
    styles,
})
export class FASTListItem extends FASTElement {
    private guard = false;

    @attr({ mode: "boolean" }) selected: boolean = false;

    @attr({ attribute: "value" }) valueAttribute?: string;
    valueAttributeChanged() {
        if (this.guard) {
            return;
        }

        this.value = this.valueAttribute;
    }

    @observable value?: any;
    valueChanged() {
        if (typeof this.value === "object") {
            return;
        }

        this.guard = true;
        this.valueAttribute = this.value?.toString();
        this.guard = false;
    }

    public select() {
        (this.parentElement as any).select(this);
    }
}
