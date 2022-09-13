import { bind, RepeatBehavior, RepeatDirective } from "@microsoft/fast-element";
import type { DataList, DataListController } from "./data-list.options.js";

export class DefaultListController implements DataListController {
    private parentElement: DataList | undefined;

    // reference to the repeat behavior used to render items
    private itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    public connect(parent: DataList) {
        this.parentElement = parent;
        if (this.itemsPlaceholder === undefined) {
            this.itemsPlaceholder = document.createComment("");
            this.parentElement.appendChild(this.itemsPlaceholder);
        }

        this.initializeRepeatBehavior();
    }

    public disconnect() {
        if (this.parentElement) {
            this.parentElement.$fastController.removeBehaviors([
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                this.itemsRepeatBehavior!,
            ]);
            this.parentElement = undefined;
        }
    }

    /**
     * initialize repeat behavior
     */
    private initializeRepeatBehavior(): void {
        if (!this.parentElement || this.itemsRepeatBehavior !== null) {
            return;
        }

        const itemsRepeatDirective = new RepeatDirective<DataList>(
            bind(x => x.items, false),
            bind(x => x.itemTemplate, false),
            { positioning: true, recycle: this.parentElement.recycle }
        );
        this.itemsRepeatBehavior = itemsRepeatDirective.createBehavior({
            [itemsRepeatDirective.nodeId]: this.itemsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.parentElement.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }
}
