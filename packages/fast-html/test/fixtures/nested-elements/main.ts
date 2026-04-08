import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

const RenderableElement = RenderableFASTElement(FASTElement);

// Mock data sources - simulating fetched data
const mockDataSources = {
    getListData(listId: string) {
        const dataSets: Record<
            string,
            { title: string; items: Array<{ text: string }> }
        > = {
            "list-1": {
                title: "My Items",
                items: [{ text: "Item 1" }, { text: "Item 2" }, { text: "Item 3" }],
            },
            "list-2": {
                title: "Empty List",
                items: [],
            },
            "list-3": {
                title: "Single Item",
                items: [{ text: "Only Item" }],
            },
        };
        return dataSets[listId] || { title: "Unknown List", items: [] };
    },
    getItemData(itemId: string) {
        // Simulate fetching individual item data
        return { text: `Loaded: ${itemId}`, timestamp: Date.now() };
    },
    getItemById(itemId: string) {
        // Simulate fetching item data by ID
        const itemDataMap: Record<string, { text: string; idx: number }> = {
            "item-1": { text: "Item 1", idx: 0 },
            "item-2": { text: "Item 2", idx: 1 },
            "item-3": { text: "Item 3", idx: 2 },
            "item-4": { text: "Only Item", idx: 0 },
        };
        return itemDataMap[itemId] || { text: "Unknown", idx: 0 };
    },
};

export class ItemList extends RenderableElement {
    public items!: Array<{ text: string }>;

    public title!: string;

    async prepare() {
        const data = mockDataSources.getListData("list-1");
        this.title = data.title;
        this.items = data.items;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

export class ParentEmptyElement extends RenderableElement {
    public emptyItems!: Array<{ text: string }>;

    public emptyTitle!: string;

    async prepare() {
        const data = mockDataSources.getListData("list-2");
        this.emptyTitle = data.title;
        this.emptyItems = data.items;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

export class ParentSingleElement extends RenderableElement {
    public singleItem!: Array<{ text: string }>;

    public singleTitle!: string;

    async prepare() {
        const data = mockDataSources.getListData("list-3");
        this.singleTitle = data.title;
        this.singleItem = data.items;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

export class Item extends RenderableElement {
    public text!: string;

    public idx!: number;

    // Track which item instance this is globally
    private static prepareCallCount = 0;
    private static instanceMap = new WeakMap<Item, number>();

    constructor() {
        super();
    }

    async prepare() {
        // Assign instance number on first prepare() call for this instance
        if (!Item.instanceMap.has(this)) {
            Item.prepareCallCount++;
            Item.instanceMap.set(this, Item.prepareCallCount);
        }

        const instanceNumber = Item.instanceMap.get(this) || 0;

        // Simulate async data loading - fetch fresh data from data source
        const itemIds = ["item-1", "item-2", "item-3", "item-4"];
        const itemId = itemIds[instanceNumber - 1] || "item-1";
        const data = mockDataSources.getItemById(itemId);

        deepMerge(this, data);
    }
}

RenderableFASTElement(ItemList).defineAsync({
    name: "parent-element",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(ParentEmptyElement).defineAsync({
    name: "parent-empty-element",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(ParentSingleElement).defineAsync({
    name: "parent-single-element",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(Item).defineAsync({
    name: "child-element",
    templateOptions: "defer-and-hydrate",
});

(window as any).messages = [];

TemplateElement.options({
    "parent-element": {
        observerMap: "all",
    },
    "parent-empty-element": {
        observerMap: "all",
    },
    "parent-single-element": {
        observerMap: "all",
    },
    "child-element": {
        observerMap: "all",
    },
})
    .config({
        elementDidDefine(name: string) {
            (window as any).messages.push(
                `Element did define: ${name} [${performance.now()}]`,
            );
        },
        elementDidHydrate(source: HTMLElement) {
            (window as any).messages.push(
                `Element did hydrate: ${source.localName} [${performance.now()}]`,
            );
        },
        elementDidRegister(name: string) {
            (window as any).messages.push(
                `Element did register: ${name} [${performance.now()}]`,
            );
        },
        elementWillHydrate(source: HTMLElement) {
            (window as any).messages.push(
                `Element will hydrate: ${source.localName} [${performance.now()}]`,
            );
        },
        hydrationComplete() {
            (window as any).messages.push(`Hydration complete [${performance.now()}]`);
        },
        templateDidUpdate(name: string) {
            (window as any).messages.push(
                `Template did update: ${name} [${performance.now()}]`,
            );
        },
        templateWillUpdate(name: string) {
            (window as any).messages.push(
                `Template will update: ${name} [${performance.now()}]`,
            );
        },
    })
    .define({
        name: "f-template",
    });
