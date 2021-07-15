var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { StealthButton } from "../stealth-button";
StealthButton;
const template = html`
    <template class="${x => (x.expanded ? "expanded" : "collapsed")}">
        <div class="header">
            ${x => x.name}
            <td-stealth-button
                class="expand-button"
                aria-label="Expand region"
                aria-controls="expanded-content collapsed-content"
                aria-expanded="${x => x.expanded.toString()}"
                @click="${(x, c) => x.handleExpandButtonClick(c.event)}"
            >
                <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M0 1C0 0.447715 0.447715 0 1 0H2C2.55228 0 3 0.447715 3 1V2C3 2.55228 2.55228 3 2 3H1C0.447715 3 0 2.55228 0 2V1Z"
                    />
                    <path
                        d="M0 7C0 6.44772 0.447715 6 1 6H2C2.55228 6 3 6.44772 3 7V8C3 8.55228 2.55228 9 2 9H1C0.447715 9 0 8.55228 0 8V7Z"
                    />
                    <path
                        d="M6 1C6 0.447715 6.44772 0 7 0H8C8.55228 0 9 0.447715 9 1V2C9 2.55228 8.55228 3 8 3H7C6.44772 3 6 2.55228 6 2V1Z"
                    />
                    <path
                        d="M6 7C6 6.44772 6.44772 6 7 6H8C8.55228 6 9 6.44772 9 7V8C9 8.55228 8.55228 9 8 9H7C6.44772 9 6 8.55228 6 8V7Z"
                    />
                </svg>
            </td-stealth-button>
        </div>
        <div class="expanded-content" role="region" id="expanded-content">
            <slot></slot>
        </div>
        <div class="collapsed-content" role="region" id="collapsed-content">
            <slot name="collapsed-content"></slot>
        </div>
        <template></template>
    </template>
`;
const styles = css`
    :host {
        display: block;
        border-bottom: 1px solid #efefef;
    }

    .header {
        display: flex;
        height: 48px;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        padding-inline-start: 16px;
        padding-inline-end: 8px;
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
let Drawer = class Drawer extends FASTElement {
    constructor() {
        super(...arguments);
        this.expanded = false;
        this.name = "";
    }
    handleExpandButtonClick() {
        this.expanded = !this.expanded;
    }
};
__decorate([attr({ mode: "boolean" })], Drawer.prototype, "expanded", void 0);
__decorate([attr], Drawer.prototype, "name", void 0);
Drawer = __decorate(
    [
        customElement({
            name: "td-drawer",
            template,
            styles,
        }),
    ],
    Drawer
);
export { Drawer };
