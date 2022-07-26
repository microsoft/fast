import { Observable, observable } from "@microsoft/fast-element";
import { _random, adjectives, nouns } from "../../../utils";

export class Pupil {
    @observable greetMessage: string;
    @observable exit: boolean = false;

    constructor(firstName: string, lastName: string) {
        const first = firstName[0].toUpperCase() + firstName.slice(1);
        const last = lastName[0].toUpperCase() + lastName.slice(1);

        this.greetMessage = `Welcome to FAST, ${first} ${last} !!`;
    }

    sayGoodbye() {
        this.greetMessage = "Goodbye, see you next time!";
    }
}

(window as any).test = () => {
    const pupil = new Pupil(
        adjectives[_random(adjectives.length)],
        nouns[_random(nouns.length)]
    );

    const notifier2 = Observable.getNotifier(pupil);
    const handler2 = {
        handleChange(source: any, propertyName: string) {
            source._exit = true;
        },
    };

    notifier2.subscribe(handler2, "greetMessage");

    pupil.sayGoodbye();
    notifier2.unsubscribe(handler2, "greetMessage");
};
