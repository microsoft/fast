export function render(): string {
    return /* html */ `
        <bind-event-bench-element needs-hydration>
            <template shadowrootmode="open">
                <button data-fe="1">Count: <!--f:b-->0<!--f:/b--></button>
            </template>
        </bind-event-bench-element>
    `;
}
