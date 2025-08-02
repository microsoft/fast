import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Observable } from "@microsoft/fast-element/observable.js";
import { RenderableFASTElement, TemplateElement } from "../../components/index.js";

// class ObserverMapTestElement extends FASTElement {
//     public users: any[] = [
//         {
//             id: 1,
//             name: "Alice Johnson",
//             details: {
//                 personal: {
//                     age: 28,
//                     location: {
//                         city: "New York",
//                         country: "USA",
//                         coordinates: {
//                             lat: 40.7128,
//                             lng: -74.006,
//                         },
//                     },
//                 },
//                 preferences: {
//                     theme: "dark",
//                     notifications: {
//                         email: true,
//                         push: false,
//                         settings: {
//                             frequency: "daily",
//                             categories: ["tech", "news"],
//                         },
//                     },
//                 },
//             },
//             posts: [
//                 {
//                     id: 101,
//                     title: "First Post",
//                     content: "Hello World!",
//                     metadata: {
//                         views: 150,
//                         likes: 25,
//                         tags: ["introduction", "hello"],
//                         author: {
//                             name: "Alice Johnson",
//                             verified: true,
//                         },
//                     },
//                 },
//                 {
//                     id: 102,
//                     title: "Tech Update",
//                     content: "Latest in technology...",
//                     metadata: {
//                         views: 320,
//                         likes: 45,
//                         tags: ["tech", "update"],
//                         author: {
//                             name: "Alice Johnson",
//                             verified: true,
//                         },
//                     },
//                 },
//             ],
//         },
//         {
//             id: 2,
//             name: "Bob Smith",
//             details: {
//                 personal: {
//                     age: 35,
//                     location: {
//                         city: "London",
//                         country: "UK",
//                         coordinates: {
//                             lat: 51.5074,
//                             lng: -0.1278,
//                         },
//                     },
//                 },
//                 preferences: {
//                     theme: "light",
//                     notifications: {
//                         email: false,
//                         push: true,
//                         settings: {
//                             frequency: "weekly",
//                             categories: ["sports", "music"],
//                         },
//                     },
//                 },
//             },
//             posts: [
//                 {
//                     id: 201,
//                     title: "Music Review",
//                     content: "Amazing concert last night...",
//                     metadata: {
//                         views: 89,
//                         likes: 12,
//                         tags: ["music", "review"],
//                         author: {
//                             name: "Bob Smith",
//                             verified: false,
//                         },
//                     },
//                 },
//             ],
//         },
//     ];

//     @attr
//     public selectedUserId: number = 1;

//     @observable
//     public stats;

//     constructor() {
//         super();

//         this.stats = {
//             totalUsers: 2,
//             activeUsers: 1,
//             metrics: {
//                 engagement: new Proxy({
//                     daily: 45,
//                     weekly: 120,
//                     monthly: 500,
//                 }, {
//                     set: (obj: any, prop: string | symbol, value: any) => {
//                         obj[prop] = value;

//                         // Trigger notification for property changes
//                         Observable.notify(this, "stats");

//                         return true;
//                     }
//                 }),
//                 performance: {
//                     loadTime: 1.2,
//                     renderTime: 0.8,
//                 },
//             },
//         }
//     }

//     // Methods to test deeply nested property changes
//     public updateUserAge = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             user.details.personal.age += 1;
//         }
//     };

//     public toggleUserTheme = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             user.details.preferences.theme =
//                 user.details.preferences.theme === "dark" ? "light" : "dark";
//         }
//     };

//     public updateUserLocation = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             // Use hardcoded values since we can only pass single argument
//             user.details.personal.location.city = "Tokyo";
//             user.details.personal.location.country = "Japan";
//             // Update coordinates randomly for demo
//             user.details.personal.location.coordinates.lat = Math.random() * 180 - 90;
//             user.details.personal.location.coordinates.lng = Math.random() * 360 - 180;
//         }
//     };

//     public addPostToUser = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             const newPostId = Math.max(...user.posts.map((p: any) => p.id)) + 1;
//             user.posts.push({
//                 id: newPostId,
//                 title: `New Post ${newPostId}`,
//                 content: `This is a new post with ID ${newPostId}`,
//                 metadata: {
//                     views: 0,
//                     likes: 0,
//                     tags: ["new", "auto-generated"],
//                     author: {
//                         name: user.name,
//                         verified: Math.random() > 0.5,
//                     },
//                 },
//             });
//         }
//     };

//     public incrementPostLikes = (postId: number) => {
//         // Find the post across all users since we only have postId
//         for (const user of this.users) {
//             const post = user.posts.find((p: any) => p.id === postId);
//             if (post) {
//                 post.metadata.likes += 1;
//                 post.metadata.views += Math.floor(Math.random() * 5) + 1;
//                 break;
//             }
//         }
//     };

//     public updateNotificationSettings = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             user.details.preferences.notifications.email =
//                 !user.details.preferences.notifications.email;
//             user.details.preferences.notifications.push =
//                 !user.details.preferences.notifications.push;

//             // Cycle through frequency options
//             const frequencies = ["daily", "weekly", "monthly"];
//             const currentIndex = frequencies.indexOf(
//                 user.details.preferences.notifications.settings.frequency
//             );
//             const nextIndex = (currentIndex + 1) % frequencies.length;
//             user.details.preferences.notifications.settings.frequency =
//                 frequencies[nextIndex];
//         }
//     };

//     public addNotificationCategory = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             // Use hardcoded category since we can only pass single argument
//             const category = "sports";
//             if (
//                 !user.details.preferences.notifications.settings.categories.includes(
//                     category
//                 )
//             ) {
//                 user.details.preferences.notifications.settings.categories.push(category);
//             }
//         }
//     };

//     public removeNotificationCategory = (userId: number) => {
//         const user = this.users.find(u => u.id === userId);
//         if (user) {
//             // Use hardcoded category since we can only pass single argument
//             const category = "tech";
//             const index =
//                 user.details.preferences.notifications.settings.categories.indexOf(
//                     category
//                 );
//             if (index > -1) {
//                 user.details.preferences.notifications.settings.categories.splice(
//                     index,
//                     1
//                 );
//             }
//         }
//     };

//     public addNewUser = () => {
//         const newId = Math.max(...this.users.map(u => u.id)) + 1;
//         this.users.push({
//             id: newId,
//             name: `User ${newId}`,
//             details: {
//                 personal: {
//                     age: Math.floor(Math.random() * 50) + 18,
//                     location: {
//                         city: "Random City",
//                         country: "Random Country",
//                         coordinates: {
//                             lat: Math.random() * 180 - 90,
//                             lng: Math.random() * 360 - 180,
//                         },
//                     },
//                 },
//                 preferences: {
//                     theme: Math.random() > 0.5 ? "dark" : "light",
//                     notifications: {
//                         email: Math.random() > 0.5,
//                         push: Math.random() > 0.5,
//                         settings: {
//                             frequency: ["daily", "weekly", "monthly"][
//                                 Math.floor(Math.random() * 3)
//                             ],
//                             categories: ["general"],
//                         },
//                     },
//                 },
//             },
//             posts: [],
//         });
//         this.stats.totalUsers = this.users.length;
//     };

//     public removeUser = (userId: number) => {
//         const index = this.users.findIndex(u => u.id === userId);
//         if (index > -1) {
//             this.users.splice(index, 1);
//             this.stats.totalUsers = this.users.length;
//         }
//     };

//     public updateStats = () => {
//         this.stats.metrics.engagement.daily += Math.floor(Math.random() * 10);
//         this.stats.metrics.engagement.weekly += Math.floor(Math.random() * 20);
//         this.stats.metrics.engagement.monthly += Math.floor(Math.random() * 50);
//         this.stats.metrics.performance.loadTime = Math.random() * 2 + 0.5;
//         this.stats.metrics.performance.renderTime = Math.random() * 1 + 0.3;
//     };

//     public selectUser = (userId: number) => {
//         this.selectedUserId = userId;
//     };
// }

// RenderableFASTElement(ObserverMapTestElement).defineAsync({
//     name: "observer-map-test-element",
//     templateOptions: "defer-and-hydrate",
// });

// TemplateElement.define({
//     name: "f-template",
// });

class ObserverMapTestElement extends FASTElement {
    public users: any[] = [
        {
            id: 1,
            name: "Alice Johnson",
            details: {
                personal: {
                    age: 28,
                    location: {
                        city: "New York",
                        country: "USA",
                        coordinates: {
                            lat: 40.7128,
                            lng: -74.006,
                        },
                    },
                },
                preferences: {
                    theme: "dark",
                    notifications: {
                        email: true,
                        push: false,
                        settings: {
                            frequency: "daily",
                            categories: ["tech", "news"],
                        },
                    },
                },
            },
            posts: [
                {
                    id: 101,
                    title: "First Post",
                    content: "Hello World!",
                    metadata: {
                        views: 150,
                        likes: 25,
                        tags: ["introduction", "hello"],
                        author: {
                            name: "Alice Johnson",
                            verified: true,
                        },
                    },
                },
                {
                    id: 102,
                    title: "Tech Update",
                    content: "Latest in technology...",
                    metadata: {
                        views: 320,
                        likes: 45,
                        tags: ["tech", "update"],
                        author: {
                            name: "Alice Johnson",
                            verified: true,
                        },
                    },
                },
            ],
        },
        {
            id: 2,
            name: "Bob Smith",
            details: {
                personal: {
                    age: 35,
                    location: {
                        city: "London",
                        country: "UK",
                        coordinates: {
                            lat: 51.5074,
                            lng: -0.1278,
                        },
                    },
                },
                preferences: {
                    theme: "light",
                    notifications: {
                        email: false,
                        push: true,
                        settings: {
                            frequency: "weekly",
                            categories: ["sports", "music"],
                        },
                    },
                },
            },
            posts: [
                {
                    id: 201,
                    title: "Music Review",
                    content: "Amazing concert last night...",
                    metadata: {
                        views: 89,
                        likes: 12,
                        tags: ["music", "review"],
                        author: {
                            name: "Bob Smith",
                            verified: false,
                        },
                    },
                },
            ],
        },
    ];

    public selectedUserId: number = 1;

    public stats = {
        totalUsers: 2,
        activeUsers: 1,
        metrics: {
            engagement: {
                daily: 45,
                weekly: 120,
                monthly: 500,
            },
            performance: {
                loadTime: 1.2,
                renderTime: 0.8,
            },
        },
    };

    // Methods to test deeply nested property changes
    public updateUserAge = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.details.personal.age += 1;
        }
    };

    public toggleUserTheme = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.details.preferences.theme =
                user.details.preferences.theme === "dark" ? "light" : "dark";
        }
    };

    public updateUserLocation = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            // Use hardcoded values since we can only pass single argument
            user.details.personal.location.city = "Tokyo";
            user.details.personal.location.country = "Japan";
            // Update coordinates randomly for demo
            user.details.personal.location.coordinates.lat = Math.random() * 180 - 90;
            user.details.personal.location.coordinates.lng = Math.random() * 360 - 180;
        }
    };

    public addPostToUser = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const newPostId = Math.max(...user.posts.map((p: any) => p.id)) + 1;
            user.posts.push({
                id: newPostId,
                title: `New Post ${newPostId}`,
                content: `This is a new post with ID ${newPostId}`,
                metadata: {
                    views: 0,
                    likes: 0,
                    tags: ["new", "auto-generated"],
                    author: {
                        name: user.name,
                        verified: Math.random() > 0.5,
                    },
                },
            });
        }
    };

    public incrementPostLikes = (postId: number) => {
        // Find the post across all users since we only have postId
        for (const user of this.users) {
            const post = user.posts.find((p: any) => p.id === postId);
            if (post) {
                post.metadata.likes += 1;
                post.metadata.views += Math.floor(Math.random() * 5) + 1;
                break;
            }
        }
    };

    public updateNotificationSettings = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.details.preferences.notifications.email =
                !user.details.preferences.notifications.email;
            user.details.preferences.notifications.push =
                !user.details.preferences.notifications.push;

            // Cycle through frequency options
            const frequencies = ["daily", "weekly", "monthly"];
            const currentIndex = frequencies.indexOf(
                user.details.preferences.notifications.settings.frequency
            );
            const nextIndex = (currentIndex + 1) % frequencies.length;
            user.details.preferences.notifications.settings.frequency =
                frequencies[nextIndex];
        }
    };

    public addNotificationCategory = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            // Use hardcoded category since we can only pass single argument
            const category = "sports";
            if (
                !user.details.preferences.notifications.settings.categories.includes(
                    category
                )
            ) {
                user.details.preferences.notifications.settings.categories.push(category);
            }
        }
    };

    public removeNotificationCategory = (userId: number) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            // Use hardcoded category since we can only pass single argument
            const category = "tech";
            const index =
                user.details.preferences.notifications.settings.categories.indexOf(
                    category
                );
            if (index > -1) {
                user.details.preferences.notifications.settings.categories.splice(
                    index,
                    1
                );
            }
        }
    };

    public addNewUser = () => {
        const newId = Math.max(...this.users.map(u => u.id)) + 1;
        this.users.push({
            id: newId,
            name: `User ${newId}`,
            details: {
                personal: {
                    age: Math.floor(Math.random() * 50) + 18,
                    location: {
                        city: "Random City",
                        country: "Random Country",
                        coordinates: {
                            lat: Math.random() * 180 - 90,
                            lng: Math.random() * 360 - 180,
                        },
                    },
                },
                preferences: {
                    theme: Math.random() > 0.5 ? "dark" : "light",
                    notifications: {
                        email: Math.random() > 0.5,
                        push: Math.random() > 0.5,
                        settings: {
                            frequency: ["daily", "weekly", "monthly"][
                                Math.floor(Math.random() * 3)
                            ],
                            categories: ["general"],
                        },
                    },
                },
            },
            posts: [],
        });
        this.stats.totalUsers = this.users.length;
    };

    public removeUser = (userId: number) => {
        const index = this.users.findIndex(u => u.id === userId);
        if (index > -1) {
            this.users.splice(index, 1);
            this.stats.totalUsers = this.users.length;
        }
    };

    public updateStats = () => {
        this.stats.metrics.engagement.daily += Math.floor(Math.random() * 10);
        this.stats.metrics.engagement.weekly += Math.floor(Math.random() * 20);
        this.stats.metrics.engagement.monthly += Math.floor(Math.random() * 50);
        this.stats.metrics.performance.loadTime = Math.random() * 2 + 0.5;
        this.stats.metrics.performance.renderTime = Math.random() * 1 + 0.3;
    };

    public selectUser = (userId: number) => {
        this.selectedUserId = userId;
    };
}

RenderableFASTElement(ObserverMapTestElement).defineAsync({
    name: "observer-map-test-element",
    templateOptions: "defer-and-hydrate",
});

// Configure TemplateElement with observerMap enabled for this test
TemplateElement.options({
    "observer-map-test-element": {
        observerMap: "all", // Enable ObserverMap to track all the nested property changes
    },
}).define({
    name: "f-template",
});
