import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class SelectiveObsElement extends FASTElement {
    public user = {
        name: "Alice",
        age: 28,
        history: {
            joined: "2020-01-01",
            visits: 100,
        },
        location: {
            city: "New York",
            country: "USA",
        },
    };

    public settings = {
        theme: "dark",
        language: "en",
    };

    public analytics = {
        charts: {
            activeChart: "line",
            cachedData: "heavy-data",
        },
        summary: "good",
    };

    public updateUserName = () => {
        this.user.name = "Bob";
    };

    public updateUserAge = () => {
        this.user.age = 29;
    };

    public updateHistory = () => {
        this.user.history.visits = 200;
    };

    public updateLocation = () => {
        this.user.location.city = "London";
    };

    public updateSettings = () => {
        this.settings.theme = "light";
    };

    public updateActiveChart = () => {
        this.analytics.charts.activeChart = "bar";
    };

    public updateCachedData = () => {
        this.analytics.charts.cachedData = "updated-heavy-data";
    };

    public updateSummary = () => {
        this.analytics.summary = "excellent";
    };
}

SelectiveObsElement.define({
    name: "selective-obs-element",
});

class AllObsElement extends FASTElement {
    public user = {
        name: "Alice",
    };

    public settings = {
        theme: "dark",
    };

    public updateUserName = () => {
        this.user.name = "Bob";
    };

    public updateSettings = () => {
        this.settings.theme = "light";
    };
}

AllObsElement.define({
    name: "all-obs-element",
});

class EmptyPropsElement extends FASTElement {
    public user = {
        name: "Alice",
    };

    public settings = {
        theme: "dark",
    };

    public updateUserName = () => {
        this.user.name = "Bob";
    };

    public updateSettings = () => {
        this.settings.theme = "light";
    };
}

EmptyPropsElement.define({
    name: "empty-props-element",
});

class ArraySelectiveElement extends FASTElement {
    public items: any[] = [
        { text: "item-1", meta: { count: 1 } },
        { text: "item-2", meta: { count: 2 } },
    ];

    public updateItemText = () => {
        this.items[0].text = "updated-item-1";
    };

    public addItem = () => {
        this.items.push({ text: "item-3", meta: { count: 3 } });
    };
}

ArraySelectiveElement.define({
    name: "array-selective-element",
});

TemplateElement.options({
    "selective-obs-element": {
        observerMap: {
            properties: {
                user: {
                    name: true,
                    age: true,
                    history: false,
                    location: true,
                },
                // settings is NOT listed → skipped
                analytics: {
                    charts: {
                        $observe: false,
                        activeChart: true,
                    },
                    summary: true,
                },
            },
        },
    },
    "all-obs-element": {
        observerMap: {},
    },
    "empty-props-element": {
        observerMap: {
            properties: {},
        },
    },
    "array-selective-element": {
        observerMap: {
            properties: {
                items: true,
            },
        },
    },
}).define({
    name: "f-template",
});
