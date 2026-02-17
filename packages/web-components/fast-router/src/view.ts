import {
    ComposableStyles,
    ElementStyles,
    ExecutionContext,
    html,
    ViewTemplate,
} from "@microsoft/fast-element";
import { isFASTElementHost, Router } from "./router.js";

/**
 * @beta
 */
export type RouterExecutionContext = ExecutionContext & {
    router?: Router;
};

/**
 * @beta
 */
export interface RouteView {
    context: RouterExecutionContext;
    bind(allTypedParams: Readonly<Record<string, any>>): void;
    appendTo(host: HTMLElement): void;
    dispose(): void;
}

/**
 * @beta
 */
export interface Transition {
    begin(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
    rollback(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
    commit(host: HTMLElement, prev: RouteView | null, next: RouteView): Promise<void>;
}

/**
 * @beta
 */
export const Transition = Object.freeze({
    default: Object.freeze({
        async begin(
            host: HTMLElement,
            prev: RouteView | null,
            next: RouteView
        ): Promise<void> {},
        async rollback(
            host: HTMLElement,
            prev: RouteView | null,
            next: RouteView
        ): Promise<void> {},
        async commit(
            host: HTMLElement,
            prev: RouteView | null,
            next: RouteView
        ): Promise<void> {},
    } as Transition),
});

/**
 * @beta
 */
export interface Layout {
    beforeCommit(routerElement: HTMLElement): Promise<void>;
    afterCommit(routerElement: HTMLElement): Promise<void>;
}

/**
 * @beta
 */
export class FASTElementLayout implements Layout {
    private styles: ElementStyles | null;

    constructor(
        private readonly template: ViewTemplate | null = null,
        styles: ComposableStyles | ComposableStyles[] | undefined = undefined,
        private runBeforeCommit = true
    ) {
        this.styles = ElementStyles.normalize(styles) ?? null;
    }

    async beforeCommit(routerElement: HTMLElement) {
        if (this.runBeforeCommit) {
            this.apply(routerElement);
        }
    }

    async afterCommit(routerElement: HTMLElement) {
        if (!this.runBeforeCommit) {
            this.apply(routerElement);
        }
    }

    private apply(routerElement: HTMLElement) {
        if (isFASTElementHost(routerElement)) {
            if (routerElement.$fastController.template !== this.template) {
                routerElement.$fastController.template = this.template!;
            }

            if (routerElement.$fastController.mainStyles !== this.styles) {
                routerElement.$fastController.mainStyles = this.styles!;
            }
        }
    }
}

/**
 * @beta
 */
export const Layout = Object.freeze({
    default: new FASTElementLayout(
        html`
            <slot></slot>
        `
    ) as Readonly<Layout>,
});
