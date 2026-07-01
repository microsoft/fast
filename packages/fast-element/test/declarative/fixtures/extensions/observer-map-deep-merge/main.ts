import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative-utilities.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { Observable, observable } from "@microsoft/fast-element/observable.js";
import { observerMap, Schema } from "@microsoft/fast-element/observer-map.js";
import { Updates } from "@microsoft/fast-element/updates.js";

interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    tags: string[];
    metadata: {
        views: number;
        rating: number;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    profile: {
        age: number;
        location: {
            city: string;
            country: string;
        };
        preferences: {
            theme: "light" | "dark";
            notifications: boolean;
        };
    };
    orders: Array<{
        id: number;
        date: string;
        total: number;
        items: Product[];
    }>;
}

interface SharedArrayFixtureData {
    items: string[];
}

class DeepMergeTestElement extends FASTElement {
    users: User[] = [
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice@example.com",
            profile: {
                age: 28,
                location: {
                    city: "New York",
                    country: "USA",
                },
                preferences: {
                    theme: "dark",
                    notifications: true,
                },
            },
            orders: [
                {
                    id: 101,
                    date: "2024-01-15",
                    total: 150.5,
                    items: [
                        {
                            id: 1001,
                            name: "Laptop",
                            price: 100.0,
                            inStock: true,
                            tags: ["electronics", "computers"],
                            metadata: {
                                views: 250,
                                rating: 4.5,
                            },
                        },
                        {
                            id: 1002,
                            name: "Mouse",
                            price: 50.5,
                            inStock: true,
                            tags: ["electronics", "accessories"],
                            metadata: {
                                views: 180,
                                rating: 4.0,
                            },
                        },
                    ],
                },
                {
                    id: 102,
                    date: "2024-02-20",
                    total: 75.0,
                    items: [
                        {
                            id: 1003,
                            name: "Keyboard",
                            price: 75.0,
                            inStock: true,
                            tags: ["electronics", "accessories"],
                            metadata: {
                                views: 120,
                                rating: 4.8,
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob@example.com",
            profile: {
                age: 35,
                location: {
                    city: "London",
                    country: "UK",
                },
                preferences: {
                    theme: "light",
                    notifications: false,
                },
            },
            orders: [
                {
                    id: 201,
                    date: "2024-03-10",
                    total: 200.0,
                    items: [
                        {
                            id: 2001,
                            name: "Headphones",
                            price: 200.0,
                            inStock: false,
                            tags: ["electronics", "audio"],
                            metadata: {
                                views: 350,
                                rating: 4.7,
                            },
                        },
                    ],
                },
            ],
        },
    ];

    @observable
    showDetails: boolean = true;

    @observable
    stats: {
        totalOrders: number;
        totalRevenue: number;
        activeUsers: number;
    } = {
        totalOrders: 3,
        totalRevenue: 425.5,
        activeUsers: 2,
    };

    // Test: Deep merge with nested object changes
    public updateUserProfile() {
        const updates = {
            profile: {
                age: 29,
                location: {
                    city: "San Francisco", // Changed
                    // country stays "USA"
                },
                preferences: {
                    theme: "light" as const, // Changed
                    // notifications stays true
                },
            },
        };

        deepMerge(this.users[0], updates);
    }

    // Test: Array replacement via deep merge
    public updateUserOrders() {
        const updates = {
            orders: [
                {
                    id: 103,
                    date: "2024-04-01",
                    total: 99.99,
                    items: [
                        {
                            id: 1004,
                            name: "Monitor",
                            price: 99.99,
                            inStock: true,
                            tags: ["electronics", "displays"],
                            metadata: {
                                views: 400,
                                rating: 4.9,
                            },
                        },
                    ],
                },
            ],
        };

        deepMerge(this.users[0], updates);
    }

    // Test: Array item removal (shorter array)
    public removeOrderItems() {
        const updates = {
            orders: [
                {
                    id: 101,
                    date: "2024-01-15",
                    total: 100.0,
                    items: [
                        // Only one item now, second item removed
                        {
                            id: 1001,
                            name: "Laptop",
                            price: 100.0,
                            inStock: true,
                            tags: ["electronics", "computers"],
                            metadata: {
                                views: 250,
                                rating: 4.5,
                            },
                        },
                    ],
                },
            ],
        };

        deepMerge(this.users[0], updates);
    }

    // Test: Nested array tag changes
    public updateProductTags() {
        const updates = {
            orders: [
                {
                    id: 101,
                    date: "2024-01-15",
                    total: 150.5,
                    items: [
                        {
                            id: 1001,
                            name: "Laptop",
                            price: 100.0,
                            inStock: true,
                            tags: ["tech", "premium", "sale"], // Changed tags
                            metadata: {
                                views: 300, // Updated
                                rating: 4.5,
                            },
                        },
                        {
                            id: 1002,
                            name: "Mouse",
                            price: 50.5,
                            inStock: false, // Changed
                            tags: ["accessories"], // Reduced tags
                            metadata: {
                                views: 180,
                                rating: 4.0,
                            },
                        },
                    ],
                },
                {
                    id: 102,
                    date: "2024-02-20",
                    total: 75.0,
                    items: [
                        {
                            id: 1003,
                            name: "Keyboard",
                            price: 75.0,
                            inStock: true,
                            tags: ["electronics", "accessories"],
                            metadata: {
                                views: 120,
                                rating: 4.8,
                            },
                        },
                    ],
                },
            ],
        };

        deepMerge(this.users[0], updates);
    }

    // Test: Complete user replacement
    public addNewUser() {
        const newUser: User = {
            id: 3,
            name: "Charlie Davis",
            email: "charlie@example.com",
            profile: {
                age: 42,
                location: {
                    city: "Tokyo",
                    country: "Japan",
                },
                preferences: {
                    theme: "dark",
                    notifications: true,
                },
            },
            orders: [],
        };

        this.users = [...this.users, newUser];
    }

    // Test: Toggle for conditional rendering
    public toggleDetails() {
        this.showDetails = !this.showDetails;
    }

    // Test: Stats update via deep merge
    public updateStats() {
        const updates = {
            totalOrders: 4,
            totalRevenue: 525.49,
            // activeUsers stays 2
        };

        deepMerge(this.stats, updates);
    }

    // Test: Direct property update
    public incrementAge() {
        this.users[0].profile.age++;
    }

    // Test: Undefined value handling
    public testUndefinedMerge() {
        const updates = {
            profile: {
                age: undefined, // Should be skipped
                location: {
                    city: "Boston",
                },
            },
        };

        deepMerge(this.users[0], updates);
    }

    public testArrayReplacement() {
        const previousOrders = this.users[0].orders;

        this.updateUserOrders();

        return {
            sameOrders: previousOrders === this.users[0].orders,
            orderCount: this.users[0].orders.length,
        };
    }

    private createProduct(id: number, name: string): Product {
        return {
            id,
            name,
            price: 10,
            inStock: true,
            tags: ["accessories"],
            metadata: {
                views: 1,
                rating: 4,
            },
        };
    }

    private createOrder(id: number, name: string = "Replacement") {
        return {
            id,
            date: "2024-06-01",
            total: 10,
            items: [this.createProduct(id * 10, name)],
        };
    }

    private createUser(id: number, name: string): User {
        return {
            id,
            name,
            email: `${name.toLowerCase().replace(/ /g, ".")}@example.com`,
            profile: {
                age: 30,
                location: {
                    city: "Seattle",
                    country: "USA",
                },
                preferences: {
                    theme: "light",
                    notifications: true,
                },
            },
            orders: [this.createOrder(id * 100)],
        };
    }

    public async mutateStaleOrdersAfterDeepMerge() {
        const oldOrders = this.users[0].orders;
        let notifications = 0;
        const notifier = Observable.getNotifier(this);
        const subscriber = {
            handleChange() {
                notifications++;
            },
        };

        notifier.subscribe(subscriber, "users");

        this.updateUserOrders();
        await Updates.next();

        notifications = 0;
        oldOrders.push(this.createOrder(900, "Stale order"));
        await Updates.next();

        notifier.unsubscribe(subscriber, "users");

        return {
            notifications,
            currentOrderCount: this.users[0].orders.length,
            staleOrderCount: oldOrders.length,
        };
    }

    public async mutateStaleNestedItemsAfterSecondDeepMerge() {
        deepMerge(this.users[0], {
            orders: [this.createOrder(901, "First replacement")],
        });
        await Updates.next();

        const oldItems = this.users[0].orders[0].items;

        deepMerge(this.users[0], {
            orders: [this.createOrder(902, "Second replacement")],
        });
        await Updates.next();

        let notifications = 0;
        const notifier = Observable.getNotifier(this);
        const subscriber = {
            handleChange() {
                notifications++;
            },
        };

        notifier.subscribe(subscriber, "users");

        oldItems.push(this.createProduct(9000, "Stale item"));
        await Updates.next();

        notifier.unsubscribe(subscriber, "users");

        return {
            notifications,
            currentItemCount: this.users[0].orders[0].items.length,
            staleItemCount: oldItems.length,
        };
    }

    public async mutateStaleUsersAfterDirectAssignment() {
        const oldUsers = this.users;
        let notifications = 0;
        const notifier = Observable.getNotifier(this);
        const subscriber = {
            handleChange() {
                notifications++;
            },
        };

        notifier.subscribe(subscriber, "users");

        this.users = [this.createUser(30, "Replacement User")];
        await Updates.next();

        notifications = 0;
        oldUsers.push(this.createUser(31, "Stale User"));
        await Updates.next();

        notifier.unsubscribe(subscriber, "users");

        return {
            notifications,
            currentUserCount: this.users.length,
            staleUserCount: oldUsers.length,
        };
    }

    public async mutateStaleOrdersAfterProxyAssignment() {
        const oldOrders = this.users[0].orders;
        let notifications = 0;
        const notifier = Observable.getNotifier(this);
        const subscriber = {
            handleChange() {
                notifications++;
            },
        };

        notifier.subscribe(subscriber, "users");

        this.users[0].orders = [this.createOrder(901, "Replacement order")];
        await Updates.next();

        notifications = 0;
        oldOrders.push(this.createOrder(902, "Stale proxy order"));
        await Updates.next();

        notifier.unsubscribe(subscriber, "users");

        return {
            notifications,
            currentOrderCount: this.users[0].orders.length,
            staleOrderCount: oldOrders.length,
        };
    }

    public async testSharedArrayOwnerReplacement() {
        const sharedItems = ["shared"];
        const ownerA = document.createElement(
            "shared-array-owner-element",
        ) as SharedArrayOwnerElement;
        const ownerB = document.createElement(
            "shared-array-owner-element",
        ) as SharedArrayOwnerElement;
        let ownerANotifications = 0;
        let ownerBNotifications = 0;
        const ownerANotifier = Observable.getNotifier(ownerA);
        const ownerBNotifier = Observable.getNotifier(ownerB);
        const ownerASubscriber = {
            handleChange() {
                ownerANotifications++;
            },
        };
        const ownerBSubscriber = {
            handleChange() {
                ownerBNotifications++;
            },
        };

        document.body.append(ownerA, ownerB);
        ownerA.data = {
            items: [],
        };
        ownerB.data = {
            items: [],
        };
        await Updates.next();

        ownerANotifier.subscribe(ownerASubscriber, "data");
        ownerBNotifier.subscribe(ownerBSubscriber, "data");

        ownerA.data.items = sharedItems;
        ownerB.data.items = sharedItems;
        await Updates.next();

        deepMerge(ownerA.data, {
            items: ["replacement"],
        });
        await Updates.next();

        ownerANotifications = 0;
        ownerBNotifications = 0;

        sharedItems.push("still owned by B");
        await Updates.next();

        ownerANotifier.unsubscribe(ownerASubscriber, "data");
        ownerBNotifier.unsubscribe(ownerBSubscriber, "data");
        ownerA.remove();
        ownerB.remove();

        return {
            ownerANotifications,
            ownerBNotifications,
            ownerAItems: [...ownerA.data.items],
            ownerBItems: [...ownerB.data.items],
            sharedItems: [...sharedItems],
        };
    }

    public async testSharedPrimitiveArrayAliasReplacement() {
        const sharedTags = ["shared"];
        const itemA = this.users[0].orders[0].items[0];
        const itemB = this.users[0].orders[0].items[1];
        let notifications = 0;
        const notifier = Observable.getNotifier(this);
        const subscriber = {
            handleChange() {
                notifications++;
            },
        };

        itemA.tags = sharedTags;
        itemB.tags = sharedTags;
        await Updates.next();

        itemB.tags = ["replacement"];
        await Updates.next();

        notifier.subscribe(subscriber, "users");

        itemA.tags.push("still owned by A");
        await Updates.next();

        notifier.unsubscribe(subscriber, "users");

        return {
            notifications,
            itemATags: [...itemA.tags],
            itemBTags: [...itemB.tags],
            sharedTags: [...sharedTags],
        };
    }

    public async replaceOrdersAndMutateNestedData() {
        this.updateUserOrders();

        await Updates.next();

        this.users[0].orders[0].total = 123.45;
        this.users[0].orders[0].items[0].metadata.views = 401;

        await Updates.next();
    }

    public async replaceOrdersAndPushNestedItem() {
        this.updateUserOrders();

        await Updates.next();

        this.users[0].orders[0].items.push({
            id: 1005,
            name: "Stand",
            price: 25.0,
            inStock: true,
            tags: ["accessories"],
            metadata: {
                views: 50,
                rating: 4.1,
            },
        });

        await Updates.next();
    }

    public async countAccessorsForInitialOrdersPush() {
        const newOrder = {
            id: 104,
            date: "2024-05-01",
            total: 25.0,
            items: [],
        };

        this.users[0].orders.push(newOrder);

        await Updates.next();

        const accessorNames = Observable.getAccessors(newOrder).map(
            accessor => accessor.name,
        );

        return {
            accessorCount: accessorNames.length,
            duplicateAccessors: accessorNames.filter(
                (name, index) => accessorNames.indexOf(name) !== index,
            ),
            orderCount: this.users[0].orders.length,
        };
    }

    public countAccessorsForInitialOrder() {
        const accessorNames = Observable.getAccessors(this.users[0].orders[0]).map(
            accessor => accessor.name,
        );

        return {
            accessorCount: accessorNames.length,
            duplicateAccessors: accessorNames.filter(
                (name, index) => accessorNames.indexOf(name) !== index,
            ),
        };
    }

    public async testDeepMergeObserverMapReentry() {
        const items = this.users[0].orders[0].items;
        const observer = Observable.getNotifier(items);
        let firstCalls = 0;
        let depth = 0;
        let maxDepth = 0;

        const nestedSubscriber = {
            handleChange() {},
        };

        observer.subscribe({
            handleChange: () => {
                firstCalls++;
                depth++;
                maxDepth = Math.max(maxDepth, depth);

                if (firstCalls === 1) {
                    deepMerge(this.users[0].orders[0], {
                        items: [
                            {
                                id: 3001,
                                name: "Dock",
                                price: 125.0,
                                inStock: true,
                                tags: ["accessories"],
                                metadata: {
                                    views: 40,
                                    rating: 4.2,
                                },
                            },
                        ],
                    });
                    observer.subscribe(nestedSubscriber);
                }

                depth--;
            },
        });

        items.push({
            id: 3000,
            name: "Cable",
            price: 10.0,
            inStock: true,
            tags: ["accessories"],
            metadata: {
                views: 10,
                rating: 4.0,
            },
        });

        await Updates.next();
        await Updates.next();

        return {
            firstCalls,
            maxDepth,
            currentItemCount: this.users[0].orders[0].items.length,
            oldItemCount: items.length,
            sameArray: items === this.users[0].orders[0].items,
        };
    }
}

class SharedArrayOwnerElement extends FASTElement {
    public data: SharedArrayFixtureData = {
        items: [],
    };
}

const sharedArrayOwnerSchema = new Schema("shared-array-owner-element");
sharedArrayOwnerSchema.addPath({
    rootPropertyName: "data",
    pathConfig: {
        type: "repeat",
        path: "data.items",
        currentContext: "item",
        parentContext: null,
    },
    childrenMap: null,
});

const hydration = enableHydration();
void hydration.whenHydrated().then(() => {
    (window as any).hydrationCompleted = true;
});

SharedArrayOwnerElement.define(
    {
        name: "shared-array-owner-element",
        schema: sharedArrayOwnerSchema,
    },
    [observerMap({ schema: sharedArrayOwnerSchema })],
);

DeepMergeTestElement.define(
    {
        name: "deep-merge-test-element",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
