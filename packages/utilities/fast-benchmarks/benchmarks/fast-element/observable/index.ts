import { Observable, observable } from "@microsoft/fast-element";
import { _random, adjectives, nouns } from "../../../utils/index.js";

export class Pupil {
    @observable greetMessage: string = "";
    @observable name: string = "";
    @observable exit: boolean = false;

    constructor(firstName: string, lastName: string) {
        const first = firstName[0].toUpperCase() + firstName.slice(1);
        const last = lastName[0].toUpperCase() + lastName.slice(1);

        this.name = `${first} ${last}`;
        this.greetMessage = `Welcome to FAST, ${this.name} !!`;
    }

    sayGoodbye() {
        this.greetMessage = `Goodbye ${this.name}, see you next time!`;
    }
}

window.runFunction = () => {
    const pupil = new Pupil(
        adjectives[_random(adjectives.length)],
        nouns[_random(nouns.length)]
    );

    const notifier2 = Observable.getNotifier(pupil);
    const handler2 = {
        handleChange(source: any, propertyName: any) {
            if (propertyName === "greetMessage") source._exit = true;
        },
    };

    notifier2.subscribe(handler2, "greetMessage");

    pupil.sayGoodbye();
    notifier2.unsubscribe(handler2, "greetMessage");
};
