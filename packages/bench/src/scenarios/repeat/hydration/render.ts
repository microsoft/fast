const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);
const listItems = items
    .map(
        (item, i) =>
            `<!--fe-repeat$$start$$${i}$$fe-repeat--><li><!--fe-b$$start$$0$$ri$$fe-b-->${item}<!--fe-b$$end$$0$$ri$$fe-b--></li><!--fe-repeat$$end$$${i}$$fe-repeat-->`,
    )
    .join("");

const shadowContent = `<ul><!--fe-b$$start$$0$$rp$$fe-b-->${listItems}<!--fe-b$$end$$0$$rp$$fe-b--></ul>`;

export function render(): string {
    return /* html */ `
        <repeat-bench-element needs-hydration>
            <template shadowrootmode="open">${shadowContent}</template>
        </repeat-bench-element>
    `;
}
