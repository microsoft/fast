import { Router } from "./router";
/**
 * @alpha
 */
export interface Route {
    readonly path: string;
    readonly name?: string;
    readonly caseSensitive?: boolean;
}
/**
 * @alpha
 */
export declare class NavigationMessage {
    path: string;
    constructor(path: string);
}
/**
 * @alpha
 */
export interface NavigationHandler {
    enqueue(msg: NavigationMessage): void;
}
/**
 * @alpha
 */
export declare const NavigationHandler: Readonly<{
    register(handler: NavigationHandler): void;
    unregister(handler: NavigationHandler): void;
}>;
/**
 * @alpha
 */
export interface NavigationQueue {
    connect(): void;
    disconnect(): void;
    receive(): Promise<NavigationMessage>;
}
/**
 * @alpha
 */
export declare const Route: Readonly<{
    path: Readonly<{
        readonly current: string;
        generateRoute(
            relativeTo: HTMLElement | Router,
            path: string,
            params?: Object
        ): Promise<string>;
        push(path: string, trigger?: boolean): void;
        replace(path: string, trigger?: boolean): void;
        trigger(path: string): void;
    }>;
    name: Readonly<{
        generateRoute(
            relativeTo: HTMLElement | Router,
            name: string,
            params?: Object
        ): Promise<string>;
        push(
            relativeTo: HTMLElement | Router,
            name: string,
            params?: Object,
            trigger?: boolean
        ): Promise<void>;
        replace(
            relativeTo: HTMLElement | Router,
            name: string,
            params?: Object,
            trigger?: boolean
        ): Promise<void>;
        trigger(
            relativeTo: HTMLElement | Router,
            name: string,
            params?: Object
        ): Promise<void>;
    }>;
}>;
/**
 * @alpha
 */
export declare class DefaultNavigationQueue
    implements NavigationQueue, NavigationHandler {
    private queue;
    private promise;
    private resolve;
    connect(): void;
    disconnect(): void;
    receive(): Promise<NavigationMessage>;
    enqueue(msg: NavigationMessage): void;
    private tryDequeue;
    handleEvent(event: PopStateEvent): void;
}
