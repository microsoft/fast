export function render(index: number): string {
    const count = `${index + 1}`;
    const label = `item-${count}`;
    return /* html */ `
        <attr-reflect-bench-element needs-hydration label="${label}" count="${count}" active>
            <template shadowrootmode="open">
                <span
                    ><!--fe-b$$start$$0$$label$$fe-b-->${label}<!--fe-b$$end$$0$$label$$fe-b-->
                    (<!--fe-b$$start$$1$$count$$fe-b-->${count}<!--fe-b$$end$$1$$count$$fe-b-->)</span
                >
            </template>
        </attr-reflect-bench-element>
    `;
}
