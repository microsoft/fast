import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociated } from "../form-associated/index";
import { customElement } from "@microsoft/fast-element";
import { FASTElement } from "@microsoft/fast-element";

export class Listbox extends FASTElement {
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;

    constructor() {
        super();
        this.constructed = true;
    }

    public keypressHandler = (e: KeyboardEvent): void => {
        console.log('button pressed');
        switch (e.keyCode) {
            case keyCodeSpace:
                console.log('space pressed');
                break;
        }
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent): void => {
        console.log(e);
    };
}