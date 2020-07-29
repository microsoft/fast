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
    @observable
    public mockElements: Node[];

    @observable
    public heading: string;

    public host: UnityHost;

    public accessibilityRoot: HTMLElement;

    private shouldClear: boolean;

    public addHeader = (headerData: string): HTMLElement => {
        const newHeader = document.createElement("p");
        newHeader.textContent = headerData;
        return newHeader;
    };

    public addButton = (buttonData: MockButton): HTMLElement => {
        const newButton = document.createElement("button");
        if (buttonData.disabled) {
            newButton.disabled = buttonData.disabled;
        }

        newButton.textContent = buttonData.name;
        newButton.id = buttonData.id;
        newButton.setAttribute("aria-label", buttonData.name);

        return newButton;
    };

    public clearAll = (e): void => {
        this.shouldClear = true;
    };

    public removeMockElements() {
        if (this.mockElements.length) {
            this.mockElements.forEach(el => this.removeChild(el));
        }
    }

    public attachElement = (el): void => {
        if (this.shouldClear) {
            this.removeMockElements();
        }

        this.shouldClear = false;

        el.slot = "mock-elements";
        this.appendChild(el);
    };

    public setHeader = (e): void => {
        this.heading = e.detail;
    };

    public attachButton = (e: CustomEvent): void => {
        const newButton = this.addButton(e.detail);
        this.attachElement(newButton);
        newButton.addEventListener(
            "keydown",
            e => {
                e.stopPropagation();
                let thisIndex = this.mockElements.indexOf(e.target as HTMLElement);
                switch (e.key) {
                    case "ArrowDown":
                        if (thisIndex < this.mockElements.length - 1) {
                            (this.mockElements[thisIndex + 1] as HTMLElement).focus();
                        }
                        break;

                    case "ArrowUp":
                        if (thisIndex > 0) {
                            (this.mockElements[thisIndex - 1] as HTMLElement).focus();
                        }
                        break;

                    default:
                    // nope
                }
            },
            true
        );
    };

    public setFocus = (e: CustomEvent): void => {
        const el = document.getElementById(e.detail);
        if (el) {
            el.focus();
        }
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
        this.addEventListener("add-header", this.setHeader, true);
        this.addEventListener("element-focused", this.setFocus, true);
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
        this.removeEventListener("add-header", this.setHeader, true);
        this.removeEventListener("element-focused", this.setFocus, true);
    }
}
