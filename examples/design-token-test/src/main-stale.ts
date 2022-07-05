import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { composedParent, DesignToken } from "@microsoft/fast-foundation";

const colors = [
    "#FFFFFF",
    "#FCFCFC",
    "#FAFAFA",
    "#F7F7F7",
    "#F5F5F5",
    "#F2F2F2",
    "#EFEFEF",
    "#EDEDED",
    "#EAEAEA",
    "#E8E8E8",
    "#E5E5E5",
    "#E2E2E2",
    "#E0E0E0",
    "#DDDDDD",
    "#DBDBDB",
    "#D8D8D8",
    "#D6D6D6",
    "#D3D3D3",
    "#D0D0D0",
    "#CECECE",
    "#CBCBCB",
    "#C9C9C9",
    "#C6C6C6",
    "#C3C3C3",
    "#C1C1C1",
    "#BEBEBE",
    "#BCBCBC",
    "#B9B9B9",
    "#B6B6B6",
    "#B4B4B4",
    "#B1B1B1",
    "#AFAFAF",
    "#ACACAC",
    "#A9A9A9",
    "#A7A7A7",
    "#A4A4A4",
    "#A2A2A2",
    "#9F9F9F",
    "#9D9D9D",
    "#9A9A9A",
    "#979797",
    "#959595",
    "#929292",
    "#909090",
    "#8D8D8D",
    "#8A8A8A",
    "#888888",
    "#858585",
    "#838383",
    "#808080",
    "#7D7D7D",
    "#7B7B7B",
    "#787878",
    "#767676",
    "#737373",
    "#717171",
    "#6E6E6E",
    "#6B6B6B",
    "#696969",
    "#666666",
    "#646464",
    "#616161",
    "#5F5F5F",
    "#5C5C5C",
    "#5A5A5A",
    "#575757",
    "#545454",
    "#525252",
    "#4F4F4F",
    "#4D4D4D",
    "#4A4A4A",
    "#484848",
    "#454545",
    "#424242",
    "#404040",
    "#3D3D3D",
    "#3B3B3B",
    "#383838",
    "#363636",
    "#333333",
    "#313131",
    "#2E2E2E",
    "#2B2B2B",
    "#292929",
    "#262626",
    "#242424",
    "#212121",
    "#1E1E1E",
    "#1B1B1B",
    "#181818",
    "#151515",
    "#121212",
    "#101010",
    "#000000",
];

const neutralPalette = DesignToken.create<string[]>("neutral-palette");
const fillColor = DesignToken.create<string>("fill-color");
@customElement({
    name: "my-root",
    styles: css``,
    template: html`
        <button @click=${x => x.reverse()}>reverse</button>
        <slot></slot>
    `,
})
export class MyRoot extends FASTElement {
    private colors = colors.concat();
    connectedCallback(): void {
        super.connectedCallback();

        neutralPalette.withDefault(this.colors);
        fillColor.withDefault(target => neutralPalette.getValueFor(target)[0]);
    }

    public reverse() {
        this.colors = this.colors.concat().reverse();
        neutralPalette.setValueFor(this, this.colors);
    }
}

@customElement({
    name: "my-card",
    template: html`
        <slot></slot>
    `,
    styles: css`
        :host {
            padding: 5px 2px;
            background: var(--fill-color);
            display: block;
        }
    `,
})
export class MyCard extends FASTElement {
    connectedCallback(): void {
        super.connectedCallback();

        fillColor.setValueFor(this, target => {
            const palette = neutralPalette.getValueFor(target);
            const fill = fillColor.getValueFor(composedParent(target)!);
            const index = palette.indexOf(fill);
            return palette.at(index - 1)!;
        });
    }
}

let root = document.createElement("my-root") as FASTElement;
document.body.appendChild(root);

let count = colors.length - 1;

while (count > 0) {
    count--;
    const el = document.createElement("my-card") as FASTElement;
    root.appendChild(el);
    root = el;
}
