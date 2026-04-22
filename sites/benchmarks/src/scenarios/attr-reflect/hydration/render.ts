export function render(index: number): string {
    const count = `${index + 1}`;
    const label = `item-${count}`;
    return /* html */ `
        <attr-reflect-bench-element needs-hydration label="${label}" count="${count}" active>
            <template shadowrootmode="open">
                <span
                    ><!--f:b-->${label}<!--f:/b-->
                    (<!--f:b-->${count}<!--f:/b-->)</span
                >
            </template>
        </attr-reflect-bench-element>
    `;
}
