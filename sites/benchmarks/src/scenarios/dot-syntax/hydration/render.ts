export function render(): string {
    return /* html */ `
        <dot-syntax-bench-element needs-hydration>
            <template shadowrootmode="open">
                <div>
                    <span><!--f:b-->Jane<!--f:/b--></span>
                    <span><!--f:b-->Seattle<!--f:/b--></span>
                    <span><!--f:b-->47.6<!--f:/b--></span>
                </div>
            </template>
        </dot-syntax-bench-element>
    `;
}
