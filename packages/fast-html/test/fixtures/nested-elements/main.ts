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

    // Track which list instance this is (1st, 2nd, or 3rd on the page)
    private static prepareCallCount = 0;
    private static instanceMap = new WeakMap<ItemList, number>();

    async prepare() {
        // Assign instance number on first prepare() call for this instance
        if (!ItemList.instanceMap.has(this)) {
            ItemList.prepareCallCount++;
            ItemList.instanceMap.set(this, ItemList.prepareCallCount);
        }

        const instanceNumber = ItemList.instanceMap.get(this) || 0;

        // Load data based on instance number, not from DOM
        const listIds = ["list-1", "list-2", "list-3"];
        const listId = listIds[instanceNumber - 1] || "list-1";
        const data = mockDataSources.getListData(listId);

        // Set data from fresh source - should match pre-rendered content exactly
        this.title = data.title;
        this.items = data.items;

        // Simulate slight delay for data loading
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

RenderableFASTElement(Item).defineAsync({
    name: "child-element",
    templateOptions: "defer-and-hydrate",
});

(window as any).messages = [];

TemplateElement.options({
    "parent-element": {
        observerMap: "all",
    },
    "child-element": {
        observerMap: "all",
    },
})
    .config({
        elementDidDefine(name: string) {
            (window as any).messages.push(
                `Element did define: ${name} [${performance.now()}]`
            );
        },
        elementDidHydrate(name: string) {
            (window as any).messages.push(
                `Element did hydrate: ${name} [${performance.now()}]`
            );
        },
        elementDidRegister(name: string) {
            (window as any).messages.push(
                `Element did register: ${name} [${performance.now()}]`
            );
        },
        elementWillHydrate(name: string) {
            (window as any).messages.push(
                `Element will hydrate: ${name} [${performance.now()}]`
            );
        },
        hydrationComplete() {
            (window as any).messages.push(`Hydration complete [${performance.now()}]`);
        },
        templateDidUpdate(name: string) {
            (window as any).messages.push(
                `Template did update: ${name} [${performance.now()}]`
            );
        },
        templateWillUpdate(name: string) {
            (window as any).messages.push(
                `Template will update: ${name} [${performance.now()}]`
            );
        },
    })
    .define({
        name: "f-template",
    });
