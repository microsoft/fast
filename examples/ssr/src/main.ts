import { app, DefaultTodoList, TodoList } from "fast-todo-app";

const SSRState = (window as any).__SSR_STATE__ || [];

TodoList.provide(document, new DefaultTodoList(SSRState));
// Simulate JS bundle download / parse / execute
setTimeout(() => app.define(), 1000);
