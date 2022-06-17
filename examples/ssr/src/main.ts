import "fast-todo-app";
import { app, DefaultTodoList, TodoList } from "fast-todo-app";

const SSRState = (window as any).__SSR_STATE__ || [];

fetch("http://localhost:8080/todos").then(data => {
    TodoList.provide(document, new DefaultTodoList(SSRState));
    app.define();
});
