import { defaultExecutionContext, ExecutionContext } from "@microsoft/fast-element";
import { Router } from "./router";

export type RouterExecutionContext = ExecutionContext & {
    router: Router;
};

export const RouterExecutionContext = Object.freeze({
    create(router: Router) {
        return Object.create(defaultExecutionContext, {
            router: {
                value: router,
            },
        });
    },
});

export interface RouteView {
    bind(
        allTypedParams: Readonly<Record<string, any>>,
        context: RouterExecutionContext
    ): void;
    appendTo(host: HTMLElement): void;
    dispose(): void;
}

export type Transition = (
    host: HTMLElement,
    prev: RouteView | null,
    next: RouteView
) => Promise<void>;

export const Transition = Object.freeze({
    async default(): Promise<void> {},
});
