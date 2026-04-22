const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);
const listItems = items
    .map((item, i) => `<!--fe:r--><li><!--fe:b-->${item}<!--fe:/b--></li><!--fe:/r-->`)
    .join("");

const shadowContent = `<ul><!--fe:b-->${listItems}<!--fe:/b--></ul>`;

export function render(): string {
    return /* html */ `
        <repeat-bench-element needs-hydration>
            <template shadowrootmode="open">${shadowContent}</template>
        </repeat-bench-element>
    `;
}
