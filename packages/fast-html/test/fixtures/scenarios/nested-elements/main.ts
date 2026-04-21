import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

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

export class ItemList extends FASTElement {
    public items!: Array<{ text: string }>;

    public title!: string;

    @attr
    public category!: string;

    // Track which list instance this is (1st, 2nd, or 3rd on the page)
    private static connectedCallCount = 0;
    private static instanceMap = new WeakMap<ItemList, number>();

    connectedCallback() {
        super.connectedCallback();

        if (!ItemList.instanceMap.has(this)) {
            ItemList.connectedCallCount++;
            ItemList.instanceMap.set(this, ItemList.connectedCallCount);
        }

        const instanceNumber = ItemList.instanceMap.get(this) || 0;

        // Load data based on instance number, not from DOM
        const listIds = ["list-1", "list-2", "list-3"];
        const listId = listIds[instanceNumber - 1] || "list-1";
        const data = mockDataSources.getListData(listId);

        // Set data from fresh source - should match pre-rendered content exactly
        this.title = data.title;
        this.items = data.items;
    }
}

export class Item extends FASTElement {
    public text!: string;

    public idx!: number;

    @attr
    public category!: string;

    // Track which item instance this is globally
    private static connectedCallCount = 0;
    private static instanceMap = new WeakMap<Item, number>();

    connectedCallback() {
        super.connectedCallback();

        if (!Item.instanceMap.has(this)) {
            Item.connectedCallCount++;
            Item.instanceMap.set(this, Item.connectedCallCount);
        }

        const instanceNumber = Item.instanceMap.get(this) || 0;

        // Fetch fresh data from data source
        const itemIds = ["item-1", "item-2", "item-3", "item-4"];
        const itemId = itemIds[instanceNumber - 1] || "item-1";
        const data = mockDataSources.getItemById(itemId);

        deepMerge(this, data);
    }
}

export class GrandChildItem extends FASTElement {
    @attr
    public category!: string;
}

export interface RepeatItemType {
    name: string;
}

export class TestElementRepeatEvent extends FASTElement {
    @observable
    repeatEventItems: Array<RepeatItemType> = [];

    @observable
    clickedItemName: string = "";

    // Called via $c.parent.handleItemClick — `this` is bound to the host
    // because the $c.parent path resolves the method owner from the context.
    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
    }
}
TestElementRepeatEvent.defineAsync({
    name: "test-element-repeat-event",
    templateOptions: "defer-and-hydrate",
});

export class TestWhenInRepeat extends FASTElement {
    @observable whenRepeatItems: Array<RepeatItemType> = [
        { name: "Alpha" },
        { name: "Beta" },
    ];
    @observable showNames: boolean = true;
    @observable clickedItemName: string = "";

    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
    }
}
TestWhenInRepeat.defineAsync({
    name: "test-when-in-repeat",
    templateOptions: "defer-and-hydrate",
});

ItemList.defineAsync({
    name: "parent-element",
    templateOptions: "defer-and-hydrate",
});

Item.defineAsync({
    name: "child-element",
    templateOptions: "defer-and-hydrate",
});

GrandChildItem.defineAsync({
    name: "grand-child-element",
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
    "grand-child-element": {
        observerMap: "all",
    },
    "test-when-in-repeat": {
        observerMap: "all",
    },
})
    .config({
        elementDidDefine(name: string) {
            (window as any).messages.push(
                `Element did define: ${name} [${performance.now()}]`,
            );
        },
        elementDidRegister(name: string) {
            (window as any).messages.push(
                `Element did register: ${name} [${performance.now()}]`,
            );
        },
        hydrationComplete() {
            (window as any).messages.push(`Hydration complete [${performance.now()}]`);
            (window as any).hydrationCompleted = true;
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
