export function render(): string {
    return /* html */ `
        <bench-element needs-hydration>
            <template shadowrootmode="open">
                <button data-fe-b-0>Count: <!--fe-b$$start$$1$$count$$fe-b-->0<!--fe-b$$end$$1$$count$$fe-b--></button>
            </template>
        </bench-element>
    `;
}
