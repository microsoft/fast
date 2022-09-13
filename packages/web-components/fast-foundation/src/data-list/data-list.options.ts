import type { FASTElement, ViewTemplate } from "@microsoft/fast-element";

/**
 *
 * @public
 */
export interface DataListController {
    connect(parent: DataList): void;
    disconnect(): void;
}

export interface DataList extends FASTElement {
    recycle: boolean;
    items: object[];
    itemTemplate: ViewTemplate;
    listItemContentsTemplate: ViewTemplate;
}
