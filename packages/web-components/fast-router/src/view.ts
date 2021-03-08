import {
    ComposableStyles,
    defaultExecutionContext,
    ElementStyles,
    ExecutionContext,
    html,
    ViewTemplate,
} from "@microsoft/fast-element";
import { isFASTElementHost, Router } from "./router";

/**
 * @alpha
 */
export type RouterExecutionContext = ExecutionContext & {
    router: Router;
};

/**
 * @alpha
 */
export const RouterExecutionContext = Object.freeze({
    create(router: Router) {
        return Object.create(defaultExecutionContext, {
            router: {
                value: router,
            },
        });
    },
});

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
 * @alpha
 */
export interface Layout {
    beforeCommit(routerElement: HTMLElement): Promise<void>;
    afterCommit(routerElement: HTMLElement): Promise<void>;
}

/**
 * @alpha
 */
export class FASTElementLayout implements Layout {
    private styles: ElementStyles | null;

    constructor(
        private readonly template: ViewTemplate | null = null,
        styles: ComposableStyles | ComposableStyles[] | null = null,
        private runBeforeCommit = true
    ) {
        this.styles =
            styles === void 0 || styles === null
                ? null
                : Array.isArray(styles)
                ? ElementStyles.create(styles)
                : styles instanceof ElementStyles
                ? styles
                : ElementStyles.create([styles]);
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

            if (routerElement.$fastController.styles !== this.styles) {
                routerElement.$fastController.styles = this.styles!;
            }
        }
    }
}

/**
 * @alpha
 */
export const Layout = Object.freeze({
    default: new FASTElementLayout(
        html`
            <slot></slot>
        `
    ) as Readonly<Layout>,
});
