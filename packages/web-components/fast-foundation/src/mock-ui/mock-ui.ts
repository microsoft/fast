import { FASTElement, observable } from "@microsoft/fast-element";
import { UnityHost } from "../unity-host";

export interface MockButton {
    id: string;
    name: string;
    disabled: boolean;
    x: number;
    y: number;
    height: number;
    width: number;
}

interface EventsMap {
    [key: string]: string[];
}

export class MockUi extends FASTElement {
    private testParams: any;

    @observable mockElements: Node[];

    public controlContainer: HTMLElement;

    public host: UnityHost;

    private shouldClear: boolean;

    public addButton = (buttonData: MockButton): HTMLElement => {
        const newButton = document.createElement("button");
        if (buttonData.disabled) {
            newButton.disabled = buttonData.disabled;
        }

        newButton.textContent = buttonData.name;
        newButton.id = buttonData.id;
        newButton.style.width = `${buttonData.width}px`;
        newButton.style.height = `${buttonData.height}px`;
        newButton.setAttribute("aria-label", buttonData.name);

        return newButton;
    };

    public clearAll = (e): void => {
        this.shouldClear = true;
    };

    public appendButton(newButton: HTMLElement, shouldFocus: boolean = false): void {}

    public removeMockElements() {
        if (this.mockElements.length) {
            this.mockElements.map(el => this.removeChild(el));
        }
    }

    public attachButton = (e): void => {
        const newButton = this.addButton(e.detail);
        newButton.slot = "mock-elements";

        if (this.shouldClear) {
            this.removeMockElements();
        }

        this.appendChild(newButton);

        if (this.shouldClear) {
            newButton.focus();
        }

        this.shouldClear = false;
    };

    public attachEvents(): void {
        const events: EventsMap = {
            click: ["click"],
            focus: ["focus", "mouseover"],
        };

        Object.entries(events).forEach(([baseEvent, eventType]) =>
            eventType.forEach(evt =>
                this.addEventListener(
                    evt,
                    e => {
                        const target = e.target as HTMLElement;
                        if (!this.isSameNode(target) && this.contains(target)) {
                            const id = target.getAttribute("id");
                            this.host.messageUnity(
                                "MenuManager",
                                `${baseEvent}Button`,
                                id
                            );
                        }
                    },
                    true
                )
            )
        );

        this.addEventListener("add-button", this.attachButton, true);
        this.addEventListener("clear-ui", this.clearAll, true);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.host = this.querySelector("fast-unity-host") as UnityHost;
        this.attachEvents();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("add-button", this.attachButton, true);
        this.removeEventListener("clear-ui", this.clearAll, true);
    }
}
