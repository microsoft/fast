import { composedParent } from "./composed-parent";

export function composedContains(reference: HTMLElement, test: HTMLElement): boolean {
    let current: HTMLElement | null = test;

    while (current !== null) {
        if (current === reference) {
            return true;
        }

        current = composedParent(current);
    }

    return false;
}
