import { attr, css, customElement, FastElement, html } from "@microsoft/fast-element";
import { StealthButton } from "../stealth-button";

StealthButton;

const template = html`
    <template class="${x => (bool(x.expanded) ? "expanded" : "collapsed")}">
        <div class="header">
            ${x => x.title}
            <td-stealth-button
                class="expand-button"
                aria-label="Expand region"
                aria-controls="expanded-content collapsed-content"
                $aria-expanded="${x => bool(x.expanded).toString()}"
                @click="${(x, c) => x.handleExpandButtonClick(c.event)}"
            >
                <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H2C2.55228 0 3 0.447715 3 1V2C3 2.55228 2.55228 3 2 3H1C0.447715 3 0 2.55228 0 2V1Z" />
                    <path d="M0 7C0 6.44772 0.447715 6 1 6H2C2.55228 6 3 6.44772 3 7V8C3 8.55228 2.55228 9 2 9H1C0.447715 9 0 8.55228 0 8V7Z" />
                    <path d="M6 1C6 0.447715 6.44772 0 7 0H8C8.55228 0 9 0.447715 9 1V2C9 2.55228 8.55228 3 8 3H7C6.44772 3 6 2.55228 6 2V1Z" />
                    <path d="M6 7C6 6.44772 6.44772 6 7 6H8C8.55228 6 9 6.44772 9 7V8C9 8.55228 8.55228 9 8 9H7C6.44772 9 6 8.55228 6 8V7Z" />
                </svg>
            </td-stealth-button>
        </div>
        <div class="expanded-content" role="region" id="expanded-content">
            <slot></slot>
        </div>
        <div class="collapsed-content" role="region" id="collapsed-content">
            <slot name="collapsed-content"></slot>
        </div>
    <template>
`;

const styles = css`
    :host {
        display: block;
        padding-inline-start: 16px;
        padding-inline-end: 8px;
        border-bottom: 1px solid #efefef;
    }

    .header {
        display: flex;
        height: 48px;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
    }

    :host(.collapsed) .expanded-content,
    :host(.expanded) .collapsed-content {
        display: none;
    }

    :host(.expanded) .expanded-content,
    :host(.collapsed) .collapsed-content {
        display: block;
    }
`;

/**
 * Process attribute values into a boolean value. Remove this
 * when proper @attr modes are supported.
 * https://github.com/microsoft/fast-dna/issues/2742
 */
export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}

@customElement({
    name: "td-drawer",
    template,
    styles,
})
export class Drawer extends FastElement {
    @attr
    public expanded: boolean;

    @attr
    public title: string = "";

    private handleExpandButtonClick(): void {
        this.expanded = !bool(this.expanded);
    }
}
