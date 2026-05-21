import { html } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way.js";
import type { TodoForm } from "./todo-form.js";

export const template = html<TodoForm>`
    <form @submit=${x => x.submitTodo()}>
        <input type="text" :value=${twoWay(x => x.description, "input")} />
        <button type="submit" ?disabled=${x => !x.description}>Add Todo</button>
    </form>
`;
