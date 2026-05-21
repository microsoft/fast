// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement } from "@microsoft/fast-html";

export class TodoItem extends RenderableFASTElement(FASTElement) {
    @attr id = "";
    @attr title = "";
    @attr state = "";

    onClick(e: MouseEvent): void {
        const target = e.composedPath()[0] as HTMLElement;
        const action = target.closest("[data-action]")?.getAttribute("data-action");

        if (!action) return;

        if (action === "toggle") {
            this.$emit("toggle-item", { id: this.id });
        } else if (action === "delete") {
            this.$emit("delete-item", { id: this.id });
        }
    }
}

TodoItem.defineAsync({
    name: "todo-item",
    templateOptions: "defer-and-hydrate",
});
