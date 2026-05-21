/** Re-exports the todo item type. */

/** Re-exports the storage connection helper. */
export { connectStoreToStorage } from "./persistence.js";
export type { Todo, TodoListFilter } from "./todo-store.js";
/** Re-exports the todo store class. */
/** Re-exports the shared todo store instance. */
export { TodoStore, todoStore } from "./todo-store.js";
