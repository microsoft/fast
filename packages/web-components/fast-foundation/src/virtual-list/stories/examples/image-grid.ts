import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";

export function registerImageGrid() {
    ImageGrid.define({
        name: "image-grid",
        template: imageGridTemplate(),
        styles: imageGridStyles,
    });
}

/**
 *
 *
 * @public
 */
export class ImageGrid extends FASTElement {
    @observable
    public sourceItems: object[] = [];

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}

const gridItemTemplate = html`
    <div
        style="
            position: absolute;
            background: lightblue;
            contain: strict;
            height:  100%;
            width:  ${(x, c) => `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
            `translateX(${c.parent.visibleItemSpans[c.index]?.start}px)`};
        "
    >
        <div style="position: absolute; margin: 5px 20px 0 20px;">${x => x.title}</div>
        <image
            style="
                position:absolute;
                height:100%;
                width:100%;
            "
            src="${x => x.url}"
        ></image>
    </div>
`;

const rowItemTemplate = html`
    <fast-virtual-list
        auto-update-mode="auto"
        orientation="horizontal"
        item-span="200"
        viewport-buffer="200"
        :viewportElement="${(x, c) => c.parent}"
        :itemTemplate="${gridItemTemplate}"
        :items="${x => x.items}"
        style="
            contain: size;
            position: absolute;
            width:  100%;
        "
    ></fast-virtual-list>
`;

/**
 * The template
 * @public
 */
export function imageGridTemplate<T extends ImageGrid>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <fast-virtual-list
                :sourceItems="${x => x.sourceItems}"
                viewport="${x => x}"
                item-size="${200}"
                viewport-buffer="${200}"
                orientation="vertical"
                auto-update-mode="auto"
                :itemContentsTemplate="${rowItemTemplate}"
                recycle="true"
            ></fast-virtual-list>
        </template>
    `;
}

export const imageGridStyles = css`
    :host {
        display: block;
        height: 400px;
        width: 400px;
    }
`;
