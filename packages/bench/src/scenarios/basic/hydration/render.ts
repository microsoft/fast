export function render(): string {
    return /* html */ `
        <bench-element needs-hydration>
            <template shadowrootmode="open">
                <slot></span>
            </template>
            hello
        </bench-element>
    `;
}
