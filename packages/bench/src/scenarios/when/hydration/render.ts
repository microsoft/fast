export function render(): string {
    return /* html */ `
        <bench-element needs-hydration>
            <template shadowrootmode="open">
                <!--fe-b$$start$$0$$w0$$fe-b--><span>Visible</span><!--fe-b$$end$$0$$w0$$fe-b-->
                <!--fe-b$$start$$1$$w1$$fe-b--><!--fe-b$$end$$1$$w1$$fe-b-->
            </template>
        </bench-element>
    `;
}
