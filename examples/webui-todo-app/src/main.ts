import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { TodoApp } from "./todo-app.js";
import { TodoForm } from "./todo-form.js";
import { DefaultTodoList, TodoList } from "./todo-list.js";

const SSRState = (window as any).__INITIAL_STATE__ || [];
TodoList.provide(document, new DefaultTodoList(SSRState));

RenderableFASTElement(TodoApp).defineAsync({
    name: "todo-app",
    templateOptions: "defer-and-hydrate",
});

RenderableFASTElement(TodoForm).defineAsync({
    name: "todo-form",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "todo-app": { observerMap: "all" },
    "todo-form": { observerMap: "all" },
}).define({
    name: "f-template",
});
