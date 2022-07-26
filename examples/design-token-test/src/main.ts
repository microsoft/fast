import {
    css,
    customElement,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { makeObservable } from "@microsoft/fast-element/utilities";
import { DesignToken } from "@microsoft/fast-foundation";
import {
    accentBaseColor,
    accentBaseSwatch,
    accentPalette,
    fillColor,
    neutralPalette,
    SwatchRGB,
} from "@microsoft/adaptive-ui";

// import { DesignToken } from "@microsoft/fast-foundation-latest";
// import { fillColor, SwatchRGB  } from "@microsoft/fast-components";

const store = makeObservable({
    value: 0,
});

DesignToken.registerRoot();
@customElement({
    name: "my-root",
    styles: css``,
    template: html`
        <button @click=${x => x.reverse()}>reverse</button>
        <slot></slot>
    `,
})
export class MyRoot extends FASTElement {
    @observable value = 0;

    public reverse() {
        store.value = store.value === 0 ? 1 : 0;
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

        // fillColor.setValueFor(this, () =>  SwatchRGB.create(store.value, store.value, store.value));
        fillColor.setValueFor(
            this,
            () => new SwatchRGB(store.value, store.value, store.value)
        );
    }
}

const root = document.createElement("my-root") as FASTElement;
document.body.appendChild(root);

let count = 100 - 1;

while (count > 0) {
    count--;
    const el = document.createElement("my-card") as FASTElement;
    root.appendChild(el);
    // root = el;
}
