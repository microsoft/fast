const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);
const listItems = items
    .map((item, i) => `<!--f:r--><li><!--f:b-->${item}<!--f:/b--></li><!--f:/r-->`)
    .join("");

const shadowContent = `<ul><!--f:b-->${listItems}<!--f:/b--></ul>`;

export function render(): string {
    return /* html */ `
        <repeat-bench-element needs-hydration>
            <template shadowrootmode="open">${shadowContent}</template>
        </repeat-bench-element>
    `;
}
