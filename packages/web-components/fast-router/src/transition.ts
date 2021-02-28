import { HTMLView } from "@microsoft/fast-element";

export type Transition = (
    host: HTMLElement,
    prev: HTMLView | null,
    next: HTMLView
) => Promise<void>;

export const Transition = Object.freeze({
    async default(): Promise<void> {},
});
