import {
    FASTElement,
    customElement,
    html,
    observable,
    DOM,
    RepeatDirective,
    RepeatBehavior,
    css,
    slotted,
    elements,
    ViewTemplate,
} from "@microsoft/fast-element";
import { FASTListItem } from "./fast-list-item";

const template = html<FASTListBox>`
    <template role="listbox">
        <slot
            ${slotted({ property: "listItems", filter: elements("fast-list-item") })}
        ></slot>
    </template>
`;

const defaultItemTemplate = html`
    <fast-list-item :value=${x => x}>${x => x}</fast-list-item>
`;

const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        border: 1px solid black;
    }
`;

@customElement({
    name: "fast-list-box",
    template,
    styles,
})
export class FASTListBox extends FASTElement {
    private repeatBehavior?: RepeatBehavior;
    private blockPlaceholder?: Node;

    @observable itemTemplate?: ViewTemplate = defaultItemTemplate;

    @observable items?: any[];
    private itemsChanged(oldValue: any[], newValue: any[]) {
        if (newValue && !this.repeatBehavior) {
            this.blockPlaceholder = document.createComment("");
            this.appendChild(this.blockPlaceholder);

            this.repeatBehavior = new RepeatDirective(
                x => x.items,
                x => x.itemTemplate,
                { positioning: false }
            ).createBehavior(this.blockPlaceholder);

            this.$fastController.addBehaviors([this.repeatBehavior!]);
        }
    }

    @observable selectedItem?: any;
    private selectedItemChanged() {
        const found = this.listItems?.find(x => x.value === this.selectedItem);

        if (found) {
            this.select(found);
        }
    }

    @observable listItems?: FASTListItem[];
    @observable selectedListItem?: FASTListItem;
    private listItemsChanged() {
        if (this.listItems) {
            const selected = this.listItems.find(x => x.selected);

            if (selected) {
                this.select(selected);
            } else {
                this.selectedItemChanged();
            }
        }
    }

    public select(item: FASTListItem) {
        if (this.selectedListItem === item) {
            return;
        }

        if (this.selectedListItem) {
            this.selectedListItem.selected = false;
        }

        this.selectedListItem = item;

        if (this.selectedListItem) {
            this.selectedListItem.selected = true;
            this.selectedItem = this.selectedListItem.value;
        }

        this.$emit("change");
    }
}
