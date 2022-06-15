import "fast-todo-app";
import { DefaultTodoList, app, TodoList } from "fast-todo-app";

TodoList.provide(document, new DefaultTodoList(/* todoData */));
todoApp.define();
