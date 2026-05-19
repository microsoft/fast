import { FASTElement, observable } from "@microsoft/fast-element";
import type { Theme } from "@microsoft/fast-examples-design-system";
import {
    getTheme,
    onThemeChange,
    toggleTheme,
} from "@microsoft/fast-examples-design-system";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { TodoList } from "./todo-list.js";

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;
    @observable public currentTheme: Theme = getTheme();

    private themeDisposer?: () => void;

    public connectedCallback(): void {
        super.connectedCallback();
        this.themeDisposer = onThemeChange(theme => {
            this.currentTheme = theme;
        });
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.themeDisposer?.();
    }

    public toggleTheme(): void {
        this.currentTheme = toggleTheme();
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
