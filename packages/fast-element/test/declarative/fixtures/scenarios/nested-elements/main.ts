import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative-utilities.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, whenHydrated } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
import { whenRegistered } from "@microsoft/fast-element/registry.js";

(window as any).messages = [];

const trackedElements = [
    "test-element-repeat-event",
    "test-when-in-repeat",
    "parent-element",
    "child-element",
    "grand-child-element",
];

for (const name of trackedElements) {
    void whenRegistered(name).then(() => {
        (window as any).messages.push(`Element registered: ${name}`);
    });
}

enableHydration();
void whenHydrated.then(() => {
    (window as any).messages.push(`Hydration complete [${performance.now()}]`);
    (window as any).hydrationCompleted = true;
});

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
    @observable
    public items: Array<{ text: string }> = [];

    @observable
    public title: string = "";

    @attr
    public category!: string;

    // Track which list instance this is (1st, 2nd, or 3rd on the page)
    private static connectedCallCount = 0;
    private static instanceMap = new WeakMap<ItemList, number>();

    connectedCallback() {
        if (!ItemList.instanceMap.has(this)) {
            ItemList.connectedCallCount++;
            ItemList.instanceMap.set(this, ItemList.connectedCallCount);
        }

        const instanceNumber = ItemList.instanceMap.get(this) || 0;
        const listIds = ["list-1", "list-2", "list-3"];
        const listId = listIds[instanceNumber - 1] || "list-1";
        const data = mockDataSources.getListData(listId);

        // Set data BEFORE super so items are in _items before
        // ElementController.bindObservables replays boundObservables
        this.title = data.title;
        this.items = data.items;

        super.connectedCallback();
    }
}

export class Item extends FASTElement {
    @observable
    public text: string = "";

    @observable
    public idx: number = 0;

    @attr
    public category!: string;

    // Track which item instance this is globally
    private static connectedCallCount = 0;
    private static instanceMap = new WeakMap<Item, number>();

    connectedCallback() {
        if (!Item.instanceMap.has(this)) {
            Item.connectedCallCount++;
            Item.instanceMap.set(this, Item.connectedCallCount);
        }

        const instanceNumber = Item.instanceMap.get(this) || 0;
        const itemIds = ["item-1", "item-2", "item-3", "item-4"];
        const itemId = itemIds[instanceNumber - 1] || "item-1";
        const data = mockDataSources.getItemById(itemId);

        // Set data before super so it's available during hydration
        deepMerge(this, data);

        super.connectedCallback();
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
TestElementRepeatEvent.define({
    name: "test-element-repeat-event",
    template: declarativeTemplate(),
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
TestWhenInRepeat.define(
    {
        name: "test-when-in-repeat",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

ItemList.define(
    {
        name: "parent-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

Item.define(
    {
        name: "child-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);

GrandChildItem.define(
    {
        name: "grand-child-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
