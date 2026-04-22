export function render(): string {
    return /* html */ `
        <when-bench-element needs-hydration>
            <template shadowrootmode="open">
                <!--fe:b--><span>Visible</span><!--fe:/b-->
                <!--fe:b--><!--fe:/b-->
            </template>
        </when-bench-element>
    `;
}
