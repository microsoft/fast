export const _random = (max) => {
    return Math.round(Math.random() * 1000) % max;
};
//generate 1k, pass this value in
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
    constructor(id) {
        this.id = id;
        this.label =
            adjectives[_random(adjectives.length)] +
                " " +
                colours[_random(colours.length)] +
                " " +
                nouns[_random(nouns.length)];
    }
}
export class NestedRandomData {
    constructor(id, randomItem1, randomItem2, randomItem3, randomItemGroup1, randomItemGroup2, nestedGroup) {
        this.id = id;
        this.randomItem1 = randomItem1;
        this.randomItem2 = randomItem2;
        this.randomItem3 = randomItem3;
        this.randomItemGroup1 = randomItemGroup1;
        this.randomItemGroup2 = randomItemGroup2;
        this.nestedGroup = nestedGroup;
    }
}
function generateData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(new RandomItem(++id));
    }
    return data;
}
function generateNestedData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(new NestedRandomData(++id2, new RandomItem(++id), new RandomItem(++id), new RandomItem(++id), generateData(10), generateData(itemCount / 2), new NestedRandomData(++id2, new RandomItem(++id), new RandomItem(++id), new RandomItem(++id), generateData(5))));
    }
    return data;
}
export const data = generateData(itemCount);
export const nestedData = generateNestedData(itemCount);
export const destroy = (container) => {
    container.innerHTML = "";
};
export const getTestStartName = (name) => `${name}-start`;
export const updateComplete = () => new Promise(r => requestAnimationFrame(r));
export function measureMemory() {
    if (window && performance && performance.memory) {
        // Report results in MBs\
        window.usedJSHeapSize = performance.memory.usedJSHeapSize / 1e6;
    }
    else {
        window.usedJSHeapSize = 0;
    }
}
