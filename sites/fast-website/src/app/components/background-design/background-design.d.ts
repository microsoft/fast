import { FASTElement } from "@microsoft/fast-element";
declare type BezierCurveTo = [number, number, number, number, number, number];
declare type MoveTo = [number, number];
interface PathData {
    C: BezierCurveTo[];
    color?: [number, number, number];
    M: MoveTo;
}
export declare class BackgroundDesign extends FASTElement {
    faded: boolean;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    waveSim: {
        scale: number;
        size: {
            width: number;
            height: number;
        };
        center: {
            x: number;
            y: number;
        };
        origin: {
            x: number;
            y: number;
        };
        percent: {
            x: number;
            y: number;
        };
    };
    time: {
        loop: number;
        scale: number;
        speed: number;
        total: number;
    };
    increments: {
        bg: number;
        waves: number;
    };
    steps: {
        bg: any[];
        waves: any[];
    };
    lineWidths: {
        bg: number;
        waves: number;
    };
    waveData: {};
    frame: number;
    prevPerf: number;
    connectedCallback(): void;
    setupFadeObserver(): void;
    setup(): void;
    convertPath(rawPath: any, color?: number[]): PathData;
    stepPoint(from: any, to: any, increments: any, step: any): any;
    generateWave(from: any, to: any, cache: any, inc: any): void;
    updateWave(thisWave: any, startPoints: any, endPoints: any, modifier: any): any;
    draw(
        {
            color,
            C,
            M,
        }: {
            color: any;
            C: any;
            M: any;
        },
        lineWidth: any
    ): void;
    update(frametime: any): void;
    easeIn: (p: any) => (t: any) => number;
    easeOut: (p: any) => (t: any) => number;
    easeInOut: (p: any) => (t: any) => number;
    reflowCanvas(): void;
}
export {};
