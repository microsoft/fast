// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FASTElement, observable } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

interface TodoItemData {
    id: string;
    description: string;
    state: string;
}

type TodoListFilter = "all" | "active" | "completed";

export class TodoApp extends FASTElement {
    @observable items: TodoItemData[] = [];
    @observable activeFilter: TodoListFilter = "all";
    @observable description: string = "";
    @observable filteredItems: TodoItemData[] = [];
    @observable activeCount: number = 0;
    @observable completedCount: number = 0;

    form!: HTMLFormElement;
    addInput!: HTMLInputElement;
    addButton!: HTMLButtonElement;

    private nextId = 100;
    private formEvents: AbortController | null = null;
    private readonly handleInput = (e: Event): void => this.onInput(e);
    private readonly handleSubmit = (e: SubmitEvent): void => {
        e.preventDefault();
        this.onSubmit();
    };

    connectedCallback(): void {
        super.connectedCallback();
        this.prepareItems();
        this.connectFormEvents();
        this.syncAddButton();
        this.syncCounts();
    }

    syncFormControls(): void {
        this.connectFormEvents();
        this.syncAddButton();
    }

    disconnectedCallback(): void {
        this.formEvents?.abort();
        this.formEvents = null;
        super.disconnectedCallback();
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

    descriptionChanged(): void {
        this.syncAddButton();
    }

    private prepareItems(): void {
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
        this.syncAddButton();
    }

    onFilterChange(e: Event): void {
        this.activeFilter = (e.target as HTMLSelectElement).value as TodoListFilter;
    }

    onSubmit(): void {
        const input = this.getAddInput();
        const text = (input?.value ?? this.description).trim();

        if (!text) return;

        this.items = [
            ...this.items,
            { id: String(this.nextId++), description: text, state: "pending" },
        ];
        this.description = "";

        if (input) {
            input.value = "";
            input.focus();
        }

        this.syncAddButton();
    }

    private connectFormEvents(): void {
        this.formEvents?.abort();
        this.formEvents = new AbortController();
        const { signal } = this.formEvents;

        this.getAddInput()?.addEventListener("input", this.handleInput, { signal });
        this.getForm()?.addEventListener("submit", this.handleSubmit, { signal });
        this.shadowRoot?.addEventListener("input", this.handleInput, { signal });
        this.shadowRoot?.addEventListener("submit", this.handleSubmit, { signal });
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
     * Work around the FAST declarative hydration text-binding mismatch (see the
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

    private syncAddButton(): void {
        const button = this.getAddButton();
        if (button) {
            button.disabled = this.description.trim().length === 0;
        }
    }

    private getForm(): HTMLFormElement | null {
        return this.form ?? this.shadowRoot?.querySelector("form") ?? null;
    }

    private getAddInput(): HTMLInputElement | null {
        return (
            this.addInput ??
            this.shadowRoot?.querySelector<HTMLInputElement>("form input[type=text]") ??
            null
        );
    }

    private getAddButton(): HTMLButtonElement | null {
        return (
            this.addButton ??
            this.shadowRoot?.querySelector<HTMLButtonElement>(
                "form button[type=submit]",
            ) ??
            null
        );
    }
}

export const todoAppDefinition = TodoApp.define(
    {
        name: "todo-app",
        template: declarativeTemplate({
            elementDidHydrate(source) {
                if (source instanceof TodoApp) {
                    source.syncFormControls();
                }
            },
        }),
    },
    [observerMap()],
);
