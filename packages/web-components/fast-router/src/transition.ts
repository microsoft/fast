import { HTMLView } from "@microsoft/fast-element";

export type Transition = (
    host: HTMLElement,
    prev: HTMLView | null,
    next: HTMLView
) => Promise<void>;

export const defaultTransition: Transition = async function transition(
    host: HTMLElement,
    prev: HTMLView | null,
    next: HTMLView
): Promise<void> {
    if (prev) {
        prev.dispose();
    }

    next.appendTo(host);
};
