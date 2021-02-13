import { attr, FASTElement, observable } from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class PickerMenu extends FASTElement {
    /**
     * Children that are list items
     *
     * @internal
     */
    public optionElements: HTMLElement[] = [];

    private observer: MutationObserver;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });
    }

    private onChildListChange = (
        mutations: MutationRecord[],
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        observer: MutationObserver
    ): void => {
        if (mutations!.length) {
            mutations.forEach((mutation: MutationRecord): void => {
                mutation.addedNodes.forEach((newNode: Node): void => {
                    if (
                        newNode.nodeType === 1 &&
                        (newNode as Element).getAttribute("role") === "listitem"
                    ) {
                        (newNode as Element).id =
                            (newNode as Element).id || uniqueId("option-");
                    }
                });
            });
        }
    };
}
