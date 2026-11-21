export function findClosestAnchor(event: MouseEvent): Element | null {
    const path: EventTarget[] = event.composedPath();

    for (let i = 0, ii = path.length; i < ii; ++i) {
        const current = path[i] as Element | null;

        if (current?.nodeType === 1 && current.tagName.toUpperCase() === "A") {
            return current;
        }
    }

    return null;
}
