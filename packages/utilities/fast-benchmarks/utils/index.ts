export const _random = (max: number) => {
    return Math.round(Math.random() * 1000) % max;
};

export const itemCount = 1000;
let id = 0;
let id2 = 0;

export const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
];
export const colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
];
export const nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
];

export class RandomItem {
    label: string;

    constructor(public readonly id: number) {
        this.label =
            adjectives[_random(adjectives.length)] +
            " " +
            colours[_random(colours.length)] +
            " " +
            nouns[_random(nouns.length)];
    }
}

export class NestedRandomData {
    constructor(
        public readonly id: number,
        public readonly randomItem1: RandomItem,
        public readonly randomItem2: RandomItem,
        public readonly randomItem3: RandomItem,
        public readonly randomItemGroup1: RandomItem[],
        public readonly randomItemGroup2?: RandomItem[],
        public readonly nestedGroup?: NestedRandomData
    ) {}
}

export function generateData(count: number) {
    const data = [];

    for (let i = 0; i < count; i++) {
        data.push(new RandomItem(++id));
    }

    return data;
}

export function generateNestedData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(
            new NestedRandomData(
                ++id2,
                new RandomItem(++id),
                new RandomItem(++id),
                new RandomItem(++id),
                generateData(10),
                generateData(itemCount / 2),
                new NestedRandomData(
                    ++id2,
                    new RandomItem(++id),
                    new RandomItem(++id),
                    new RandomItem(++id),
                    generateData(5)
                )
            )
        );
    }

    return data;
}

export const data: RandomItem[] = generateData(itemCount);
export const nestedData: NestedRandomData[] = generateNestedData(itemCount);

export const destroy = (container: { innerHTML: string }) => {
    container.innerHTML = "";
};
export const getTestStartName = (name: any) => `${name}-start`;
export const updateComplete = () => new Promise(r => requestAnimationFrame(r));

declare global {
    interface Window {
        gc: () => void;
        usedJSHeapSize: number;
    }
    interface Performance {
        memory: {
            usedJSHeapSize: number;
        };
    }
}

export function measureMemory() {
    if (window && performance && performance.memory) {
        // Report results in MBs\
        window.usedJSHeapSize = performance.memory.usedJSHeapSize / 1e6;
    } else {
        window.usedJSHeapSize = 0;
    }
}
