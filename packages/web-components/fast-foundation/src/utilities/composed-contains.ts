import { composedParent } from "./composed-parent";

export function composedContains(reference: HTMLElement, test: HTMLElement): boolean {
    let current: HTMLElement | null = reference;

    if (test === current) {
        return true; // match Node.contains() behavior
    }

    do {
        const parent = composedParent(test);

        if (parent === reference) {
            return true;
        }

        current = parent;
    } while (current !== null);

    return false;
}
