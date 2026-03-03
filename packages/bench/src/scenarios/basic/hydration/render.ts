export function render(): string {
    return /* html */ `
        <basic-element>
            <template shadowrootmode="open">
                <slot></span>
            </template>
            hello
        </basic-element>
    `;
}
