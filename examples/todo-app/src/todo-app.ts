import { FASTElement, observable } from "@microsoft/fast-element";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { TodoList } from "./todo-list.js";

type Theme = "auto" | "light" | "dark";

function readTheme(): Theme {
    const value = document.documentElement.getAttribute("data-theme");
    return value === "light" || value === "dark" ? value : "auto";
}

function writeTheme(theme: Theme): void {
    if (theme === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;
    @observable public currentTheme: Theme = readTheme();

    public toggleTheme(): void {
        const next: Theme =
            this.currentTheme === "auto"
                ? "light"
                : this.currentTheme === "light"
                  ? "dark"
                  : "auto";
        writeTheme(next);
        this.currentTheme = next;
    }
}

// By using this API instead of the @customElement
// decorator, we are able to assemble the component
// with its name, template, and styles, but without
// immediately defining it with the platform. We do
// this so that we can control the startup timing of
// the app. See the main.ts file for further
// explanation.
export const app = TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
