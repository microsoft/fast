import { observable, attr } from "@microsoft/fast-element";

export class TodoItem {
    @attr ariaLabel: string = "Remove item";
    @observable description: string;
    @observable done: boolean = false;

    constructor(description: string) {
        this.description = description;
    }

    public toggleDone() {
        this.done = !this.done;
    }
}
