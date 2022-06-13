export declare const _random: (max: number) => number;
export declare const itemCount = 1000;
export declare const adjectives: string[];
export declare const colours: string[];
export declare const nouns: string[];
export declare class RandomItem {
    readonly id: number;
    label: string;
    constructor(id: number);
}
export declare class NestedRandomData {
    readonly id: number;
    readonly randomItem1: RandomItem;
    readonly randomItem2: RandomItem;
    readonly randomItem3: RandomItem;
    readonly randomItemGroup1: RandomItem[];
    readonly randomItemGroup2?: RandomItem[] | undefined;
    readonly nestedGroup?: NestedRandomData | undefined;
    constructor(id: number, randomItem1: RandomItem, randomItem2: RandomItem, randomItem3: RandomItem, randomItemGroup1: RandomItem[], randomItemGroup2?: RandomItem[] | undefined, nestedGroup?: NestedRandomData | undefined);
}
export declare const data: RandomItem[];
export declare const nestedData: NestedRandomData[];
export declare const destroy: (container: {
    innerHTML: string;
}) => void;
export declare const getTestStartName: (name: any) => string;
export declare const updateComplete: () => Promise<unknown>;
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
export declare function measureMemory(): void;
