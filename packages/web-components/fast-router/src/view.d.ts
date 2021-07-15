import {
    ComposableStyles,
    ExecutionContext,
    ViewTemplate,
} from "@microsoft/fast-element";
import { Router } from "./router";
/**
 * @alpha
 */
export declare type RouterExecutionContext = ExecutionContext & {
    router: Router;
};
/**
 * @alpha
 */
export declare const RouterExecutionContext: Readonly<{
    create(router: Router): any;
}>;
/**
 * @alpha
 */
export interface RouteView {
    bind(
        allTypedParams: Readonly<Record<string, any>>,
        context: RouterExecutionContext
    ): void;
    appendTo(host: HTMLElement): void;
    dispose(): void;
}
/**
 * @alpha
 */
export interface Transition {
    begin(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
    rollback(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
    commit(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
}
/**
 * @alpha
 */
export declare const Transition: Readonly<{
    default: Readonly<Transition>;
}>;
/**
 * @alpha
 */
export interface Layout {
    beforeCommit(routerElement: HTMLElement): Promise<void>;
    afterCommit(routerElement: HTMLElement): Promise<void>;
}
/**
 * @alpha
 */
export declare class FASTElementLayout implements Layout {
    private readonly template;
    private runBeforeCommit;
    private styles;
    constructor(
        template?: ViewTemplate | null,
        styles?: ComposableStyles | ComposableStyles[] | null,
        runBeforeCommit?: boolean
    );
    beforeCommit(routerElement: HTMLElement): Promise<void>;
    afterCommit(routerElement: HTMLElement): Promise<void>;
    private apply;
}
/**
 * @alpha
 */
export declare const Layout: Readonly<{
    default: Readonly<Layout>;
}>;
