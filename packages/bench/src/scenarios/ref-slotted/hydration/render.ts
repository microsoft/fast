export function render(): string {
    return /* html */ `
        <ref-slotted-bench-element needs-hydration>
            <template shadowrootmode="open">
                <h3 data-fe-b-0>Title</h3>
                <slot data-fe-b-1></slot>
            </template>
            <span>slotted content</span>
        </ref-slotted-bench-element>
    `;
}
