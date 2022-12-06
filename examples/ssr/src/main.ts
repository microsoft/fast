import "@microsoft/fast-element/install-element-hydration";
import { app, DefaultTodoList, TodoList } from "fast-todo-app";

const SSRState = (window as any).__SSR_STATE__ || [];

TodoList.provide(document, new DefaultTodoList(SSRState));
app.define();
