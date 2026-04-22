export function render(): string {
    return /* html */ `
        <when-bench-element needs-hydration>
            <template shadowrootmode="open">
                <!--f:b--><span>Visible</span><!--f:/b-->
                <!--f:b--><!--f:/b-->
            </template>
        </when-bench-element>
    `;
}
