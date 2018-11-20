declare class ResizeObservation {
    public readonly target: Element;
    public readonly broadcastWidth: number;
    public readonly broadcastHeight: number;
    constructor(target: Element);
    public isActive(): boolean;
}
