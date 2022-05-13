export declare const _random: (max: number) => number;
export declare const adjectives: string[];
export declare const colours: string[];
export declare const nouns: string[];
export declare class RandomItem {
    readonly id: number;
    label: string;
    constructor(id: number);
}
export declare const data: RandomItem[];
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
