// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement } from "@microsoft/fast-html";

interface TodoItemData {
    id: string;
    description: string;
    state: string;
}

type TodoListFilter = "all" | "active" | "completed";

export class TodoApp extends RenderableFASTElement(FASTElement) {
    @observable items: TodoItemData[] = [];
    @observable activeFilter: TodoListFilter = "all";
    @observable description: string = "";
    @observable filteredItems: TodoItemData[] = [];
    @observable activeCount: number = 0;
    @observable completedCount: number = 0;

    addInput!: HTMLInputElement;

    private nextId = 100;

    connectedCallback(): void {
        super.connectedCallback();
        this.syncCounts();
    }

    itemsChanged(): void {
        this.recomputeFilteredItems();
        this.recomputeCounts();
    }

    activeFilterChanged(): void {
        this.recomputeFilteredItems();
    }

    activeCountChanged(): void {
        this.syncCounts();
    }

    completedCountChanged(): void {
        this.syncCounts();
    }

    async prepare(): Promise<void> {
        const items: TodoItemData[] = [];

        for (const el of this.shadowRoot!.querySelectorAll("todo-item")) {
            items.push({
                id: el.getAttribute("id") || "",
                description: el.getAttribute("description") || "",
                state: el.getAttribute("state") || "pending",
            });
        }

        this.items = items;

        if (items.length > 0) {
            this.nextId = Math.max(...items.map(i => Number(i.id) || 0)) + 1;
        }
    }

    onToggleItem(e: CustomEvent<{ id: string }>): void {
        this.items = this.items.map(item =>
            item.id === e.detail.id
                ? {
                      id: item.id,
                      description: item.description,
                      state: item.state === "done" ? "pending" : "done",
                  }
                : item,
        );
    }

    onDeleteItem(e: CustomEvent<{ id: string }>): void {
        this.items = this.items.filter(item => item.id !== e.detail.id);
    }

    onInput(e: Event): void {
        this.description = (e.target as HTMLInputElement).value;
    }

    onFilterChange(e: Event): void {
        this.activeFilter = (e.target as HTMLSelectElement).value as TodoListFilter;
    }

    onSubmit(): void {
        const text = this.description.trim();

        if (!text) return;

        this.items = [
            ...this.items,
            { id: String(this.nextId++), description: text, state: "pending" },
        ];
        this.description = "";

        if (this.addInput) {
            this.addInput.value = "";
            this.addInput.focus();
        }
    }

    private recomputeFilteredItems(): void {
        switch (this.activeFilter) {
            case "active":
                this.filteredItems = this.items.filter(i => i.state !== "done");
                break;
            case "completed":
                this.filteredItems = this.items.filter(i => i.state === "done");
                break;
            default:
                this.filteredItems = this.items;
        }
    }

    private recomputeCounts(): void {
        let active = 0;
        let completed = 0;

        for (const item of this.items) {
            if (item.state === "done") {
                completed++;
            } else {
                active++;
            }
        }

        this.activeCount = active;
        this.completedCount = completed;
    }

    /**
     * Work around the fast-html hydration text-binding mismatch (see the
     * `<todo-item>` `syncDescription()` helper for context): write the
     * footer counters into the shadow DOM imperatively rather than via
     * `{{ activeCount }}` / `{{ completedCount }}` text interpolations.
     */
    private syncCounts(): void {
        const activeSpan = this.shadowRoot?.querySelector(".active-count");
        const completedSpan = this.shadowRoot?.querySelector(".completed-count");

        if (activeSpan) {
            activeSpan.textContent = `${this.activeCount} ${
                this.activeCount === 1 ? "item" : "items"
            } left`;
        }

        if (completedSpan) {
            completedSpan.textContent = `${this.completedCount} completed`;
        }
    }
}

TodoApp.defineAsync({
    name: "todo-app",
    templateOptions: "defer-and-hydrate",
});
