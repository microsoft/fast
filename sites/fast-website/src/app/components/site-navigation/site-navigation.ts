import { FASTElement, observable } from "@microsoft/fast-element";

export class SiteNavigation extends FASTElement {
    @observable
    items: HTMLElement[];

    public connectedCallback(): void {
        super.connectedCallback();
        this.items.forEach((item: any) => {
            if (item instanceof HTMLElement) {
                item.setAttribute("role", "listitem");
            }
        });
    }
}
