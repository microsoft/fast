const shadowRoots = new WeakMap<HTMLElement, ShadowRoot>();

export function setShadowRoot(element: HTMLElement, shadowRoot: ShadowRoot) {
    shadowRoots.set(element, shadowRoot);
}

export function getShadowRoot(element: HTMLElement): ShadowRoot | null {
    return element.shadowRoot ?? shadowRoots.get(element) ?? null;
}
