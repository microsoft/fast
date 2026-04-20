export function render(): string {
    return /* html */ `
        <basic-bench-element needs-hydration>
            <template shadowrootmode="open">
                <slot></span>
            </template>
            hello
        </basic-bench-element>
    `;
}
