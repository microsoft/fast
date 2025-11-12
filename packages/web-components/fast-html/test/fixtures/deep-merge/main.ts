import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "../../../src/index.js";
import { deepMerge } from "../../../src/components/utilities.js";

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
}

TemplateElement.options({
    "deep-merge-test-element": {
        observerMap: "all",
    },
}).define({
    name: "f-template",
});

RenderableFASTElement(DeepMergeTestElement).defineAsync({
    name: "deep-merge-test-element",
    templateOptions: "defer-and-hydrate",
});
