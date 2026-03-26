// Inline render functions from each scenario, renaming bench-element to the
// scenario-specific name used in the combined <f-template>.

function renderBasic(): string {
    return `
        <bench-basic needs-hydration>
            <template shadowrootmode="open">
                <slot></slot>
            </template>
            hello
        </bench-basic>
    `;
}

function renderAttrReflect(index: number): string {
    const count = `${index + 1}`;
    const label = `item-${count}`;
    return `
        <bench-attr-reflect needs-hydration label="${label}" count="${count}" active>
            <template shadowrootmode="open">
                <span
                    ><!--fe-b$$start$$0$$label$$fe-b-->${label}<!--fe-b$$end$$0$$label$$fe-b-->
                    (<!--fe-b$$start$$1$$count$$fe-b-->${count}<!--fe-b$$end$$1$$count$$fe-b-->)</span
                >
            </template>
        </bench-attr-reflect>
    `;
}

function renderBindEvent(): string {
    return `
        <bench-bind-event needs-hydration>
            <template shadowrootmode="open">
                <button data-fe-b-0>Count: <!--fe-b$$start$$1$$count$$fe-b-->0<!--fe-b$$end$$1$$count$$fe-b--></button>
            </template>
        </bench-bind-event>
    `;
}

function renderDotSyntax(): string {
    return `
        <bench-dot-syntax needs-hydration>
            <template shadowrootmode="open">
                <div>
                    <span><!--fe-b$$start$$0$$t0$$fe-b-->Jane<!--fe-b$$end$$0$$t0$$fe-b--></span>
                    <span><!--fe-b$$start$$1$$t0$$fe-b-->Seattle<!--fe-b$$end$$1$$t0$$fe-b--></span>
                    <span><!--fe-b$$start$$2$$t0$$fe-b-->47.6<!--fe-b$$end$$2$$t0$$fe-b--></span>
                </div>
            </template>
        </bench-dot-syntax>
    `;
}

function renderRefSlotted(): string {
    return `
        <bench-ref-slotted needs-hydration>
            <template shadowrootmode="open">
                <h3 data-fe-b-0>Title</h3>
                <slot data-fe-b-1></slot>
            </template>
            <span>slotted content</span>
        </bench-ref-slotted>
    `;
}

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);
const listItems = items
    .map(
        (item, i) =>
            `<!--fe-repeat$$start$$${i}$$fe-repeat--><li><!--fe-b$$start$$0$$ri$$fe-b-->${item}<!--fe-b$$end$$0$$ri$$fe-b--></li><!--fe-repeat$$end$$${i}$$fe-repeat-->`,
    )
    .join("");
const repeatShadow = `<ul><!--fe-b$$start$$0$$rp$$fe-b-->${listItems}<!--fe-b$$end$$0$$rp$$fe-b--></ul>`;

function renderRepeat(): string {
    return `
        <bench-repeat needs-hydration>
            <template shadowrootmode="open">${repeatShadow}</template>
        </bench-repeat>
    `;
}

function renderWhen(): string {
    return `
        <bench-when needs-hydration>
            <template shadowrootmode="open">
                <!--fe-b$$start$$0$$w0$$fe-b--><span>Visible</span><!--fe-b$$end$$0$$w0$$fe-b-->
                <!--fe-b$$start$$1$$w1$$fe-b--><!--fe-b$$end$$1$$w1$$fe-b-->
            </template>
        </bench-when>
    `;
}

const renders: Array<(index: number) => string> = [
    () => renderBasic(),
    i => renderAttrReflect(i),
    () => renderBindEvent(),
    () => renderDotSyntax(),
    () => renderRefSlotted(),
    () => renderRepeat(),
    () => renderWhen(),
];

export function render(index: number): string {
    return renders[index % renders.length](index);
}
