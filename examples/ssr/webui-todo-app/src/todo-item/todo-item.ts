// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export class TodoItem extends FASTElement {
    @attr id = "";
    @attr description = "";
    @attr state = "";

    connectedCallback(): void {
        super.connectedCallback();
        this.syncDescription();
    }

    descriptionChanged(): void {
        this.syncDescription();
    }

    onToggleChange(): void {
        this.$emit("toggle-item", { id: this.id });
    }

    onDeleteClick(): void {
        this.$emit("delete-item", { id: this.id });
    }

    /**
     * Work around a known fast-html hydration mismatch for text-interpolation
     * bindings inside `<todo-item>`: rather than rely on `{{ description }}` in
     * the shadow template, assign the description text imperatively. See the
     * hydration warning fast-html logs when this binding is left in place.
     */
    private syncDescription(): void {
        const span = this.shadowRoot?.querySelector(".description");
        if (span) {
            span.textContent = this.description;
        }
    }
}

TodoItem.define(
    {
        name: "todo-item",
        template: declarativeTemplate() as any,
    },
    [observerMap()],
);
