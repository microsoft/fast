import { DefaultTodoList, TodoList } from "./todo-list.js";
import { app } from "./todo-app.js";

TodoList.provide(document, new DefaultTodoList());
app.define();
