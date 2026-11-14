import type { HostBehavior, HostController } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element/css.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
import {
    type ExpressionNotifier,
    Observable,
} from "@microsoft/fast-element/observable.js";

const sharedStyles = css`
    .shared-action {
        background-color: rgb(17, 93, 157);
    }
`;

class ConditionalStyleBehavior implements HostBehavior<SharedStyleDemo> {
    private _controller: HostController<SharedStyleDemo> | null = null;
    private _enabled = false;
    private readonly _observer: ExpressionNotifier<SharedStyleDemo, boolean>;

    constructor(condition: (source: SharedStyleDemo) => boolean) {
        this._observer = Observable.binding(condition, this);
    }

    connectedCallback(controller: HostController<SharedStyleDemo>): void {
        this._controller = controller;
        this.handleChange();
    }

    disconnectedCallback(controller: HostController<SharedStyleDemo>): void {
        this._controller = null;
        this._observer.dispose();

        if (this._enabled) {
            controller.removeStyles(sharedStyles);
            this._enabled = false;
        }
    }

    handleChange(): void {
        const controller = this._controller;

        if (controller === null) {
            return;
        }

        const enabled = this._observer.observe(controller.source);

        if (enabled === this._enabled) {
            return;
        }

        this._enabled = enabled;

        if (enabled) {
            controller.addStyles(sharedStyles);
        } else {
            controller.removeStyles(sharedStyles);
        }
    }
}

export class SharedStyleDemo extends FASTElement {
    declare showActions: boolean;
    declare showOverflowMenu: boolean;

    constructor() {
        super();
        this.showActions = false;
        this.showOverflowMenu = false;
        this.$fastController.addBehavior(
            new ConditionalStyleBehavior(source => source.showActions),
        );
        this.$fastController.addBehavior(
            new ConditionalStyleBehavior(source => source.showOverflowMenu),
        );
    }
}

Observable.defineProperty(SharedStyleDemo.prototype, "showActions");
Observable.defineProperty(SharedStyleDemo.prototype, "showOverflowMenu");

await SharedStyleDemo.define({
    name: "shared-style-owner-demo",
    template: html<SharedStyleDemo>`
        <button class="shared-action" :hidden=${source => !source.showActions}>
            Action buttons
        </button>
        <button class="shared-action" :hidden=${source => !source.showOverflowMenu}>
            Overflow menu
        </button>
    `,
    styles: css`
        button {
            background-color: rgb(230, 230, 230);
        }
    `,
});

const demo = document.querySelector<SharedStyleDemo>("shared-style-owner-demo")!;
const actionsToggle = document.querySelector<HTMLInputElement>("#show-actions")!;
const menuToggle = document.querySelector<HTMLInputElement>("#show-overflow-menu")!;

actionsToggle.addEventListener("change", () => {
    demo.showActions = actionsToggle.checked;
});
menuToggle.addEventListener("change", () => {
    demo.showOverflowMenu = menuToggle.checked;
});
actionsToggle.disabled = false;
menuToggle.disabled = false;
