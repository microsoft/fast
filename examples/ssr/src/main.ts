import "fast-todo-app";
import { app, DefaultTodoList, TodoList } from "fast-todo-app";

fetch("http://localhost:8080/todos")
    .then(response => response.json())
    .then(data => {
        TodoList.provide(document, new DefaultTodoList(data));
        app.define();
    });
