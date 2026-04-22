export function render(): string {
    return /* html */ `
        <dot-syntax-bench-element needs-hydration>
            <template shadowrootmode="open">
                <div>
                    <span><!--fe:b-->Jane<!--fe:/b--></span>
                    <span><!--fe:b-->Seattle<!--fe:/b--></span>
                    <span><!--fe:b-->47.6<!--fe:/b--></span>
                </div>
            </template>
        </dot-syntax-bench-element>
    `;
}
