import { createCsrAdapter } from "./csr.js";
import { ssrWebuiTodoAdapter } from "./ssr-webui-todo.js";
import type { TodoAppAdapter } from "./types.js";

const adapters: Record<string, TodoAppAdapter> = {
    "csr-todo": createCsrAdapter("csr-todo"),
    "csr-todo-mobx": createCsrAdapter("csr-todo-mobx"),
    "ssr-webui-todo": ssrWebuiTodoAdapter,
};

export function getAdapter(projectName: string): TodoAppAdapter {
    const adapter = adapters[projectName];
    if (!adapter) {
        throw new Error(
            `No TodoAppAdapter registered for Playwright project "${projectName}".`,
        );
    }
    return adapter;
}
