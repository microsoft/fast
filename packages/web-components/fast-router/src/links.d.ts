/**
 * @alpha
 */
export interface LinkHandler {
    connect(): void;
    disconnect(): void;
}
/**
 * @alpha
 */
export declare class DefaultLinkHandler implements LinkHandler {
    private handler;
    connect(): void;
    disconnect(): void;
    private getEventInfo;
    private findClosestAnchor;
    private targetIsThisWindow;
}
