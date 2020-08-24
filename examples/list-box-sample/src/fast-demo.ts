import {
    FASTElement,
    customElement,
    html,
    observable,
    repeat,
    ref,
    css,
} from "@microsoft/fast-element";
import { FASTListBox } from "./fast-list-box";

class Person {
    public readonly avatar: string;

    constructor(public firstName: string, public lastName: string) {
        this.avatar = `https://api.adorable.io/avatars/64/${this.firstName}@adorable.png`;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

const personTemplate = html<Person>`
    <fast-list-item :value=${x => x} class="person">
        <img src=${x => x.avatar} class="avatar" />
        <span class="name">${x => x.fullName}</span>
    </fast-list-item>
`;

const template = html<FASTDemo>`
    <h1>ListBox Demo</h1>

    <section>
        <h2>Inline List</h2>
        <fast-list-box @change=${(x, c) => x.onChange(c.event as any)}>
            <fast-list-item value="One">One</fast-list-item>
            <fast-list-item value="Two" selected>Two</fast-list-item>
            <fast-list-item value="Three">Three</fast-list-item>
            <fast-list-item value="Four">Four</fast-list-item>
            <fast-list-item value="Five">Five</fast-list-item>
        </fast-list-box>
        Selected Value:
        <span></span>
    </section>

    <section>
        <h2>Hybrid List</h2>
        <fast-list-box @change=${(x, c) => x.onChange(c.event as any)}>
            <fast-list-item value="None" selected>None</fast-list-item>

            ${repeat(
                x => x.data,
                html`
                    <fast-list-item :value=${x => x}>${x => x}</fast-list-item>
                `
            )}
        </fast-list-box>
        Selected Value:
        <span></span>
    </section>

    <section>
        <h2>Bound List</h2>
        <fast-list-box
            :items=${x => x.data}
            :selectedItem=${() => 2}
            @change=${(x, c) => x.onChange(c.event as any)}
        ></fast-list-box>
        Selected Value:
        <span></span>
    </section>

    <section>
        <h2>Bound List (Custom Template)</h2>
        <fast-list-box
            :items=${x => x.people}
            :itemTemplate=${personTemplate}
            :selectedItem=${x => x.people[1]}
            @change=${(x, c) => x.onChange(c.event as any)}
        ></fast-list-box>
        Selected Value:
        <span></span>
    </section>
`;

const styles = css`
    .person {
        display: flex;
        align-items: center;
        padding: 4px;
    }

    .person .name {
        font-size: 64px;
        margin-left: 8px;
    }

    .person .avatar {
        border-radius: 50%;
    }
`;

@customElement({
    name: "fast-demo",
    template,
    shadowOptions: null,
    styles,
})
export class FASTDemo extends FASTElement {
    @observable data = [1, 2, 3, 4, 5];
    @observable people = [new Person("John", "Doe"), new Person("Billy", "Bob")];

    onChange(event: CustomEvent) {
        const target = event.target as FASTListBox;
        target.nextElementSibling!.innerHTML = JSON.stringify(
            target.selectedItem,
            null,
            2
        );
    }
}
