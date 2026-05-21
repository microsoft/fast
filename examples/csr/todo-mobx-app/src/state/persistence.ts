import { autorun } from "mobx";
import type { TodoStore } from "./todo-store.js";

/** Connects a todo store to localStorage and returns an autorun disposer. */
export function connectStoreToStorage(store: TodoStore, key: string): () => void {
    try {
        const serialized = localStorage.getItem(key);

        if (serialized !== null) {
            store.hydrate(JSON.parse(serialized));
        }
    } catch {
        // Ignore storage and parse failures in unsupported environments.
    }

    return autorun(() => {
        try {
            localStorage.setItem(
                key,
                JSON.stringify({
                    todos: store.todos,
                    activeFilter: store.activeFilter,
                }),
            );
        } catch {
            // Ignore storage write failures in unsupported environments.
        }
    });
}
