export interface Coords {
    x: number;
    y: number;
}
export interface Dimensions {
    width: number;
    height: number;
}
interface ViewBox extends Dimensions, Coords {}
export declare const waveData: {
    viewbox: ViewBox;
    layers: {
        [key: string]: {
            color: [number, number, number];
            from: string;
            to: string;
        }[];
    };
};
export {};
