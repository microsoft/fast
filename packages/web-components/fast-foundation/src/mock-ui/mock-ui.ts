import { FASTElement, observable } from "@microsoft/fast-element";

export interface MockButton {
    id: string;
    name: string;
    disabled: boolean;
    x: number;
    y: number;
    height: number;
    width: number;
}

export class MockUi extends FASTElement {
    private testParams: any;

    @observable
    public mockElements: Node[];

    public addButton = (buttonData: MockButton): HTMLElement => {
        const newButton = document.createElement("button");
        if (buttonData.disabled) {
            newButton.disabled = buttonData.disabled;
        }

        newButton.textContent = buttonData.name;
        newButton.id = buttonData.id;
        newButton.style.width = `${buttonData.width}px`;
        newButton.style.height = `${buttonData.height}px`;

        return newButton;
    };

    public clearAll = (): void => this.mockElements.forEach(m => this.removeChild(m));

    public attachButton = (e): void => {
        const newButton = this.addButton(e.detail as MockButton);
        newButton.slot = "mock-elements";
        this.appendChild(newButton);
    };

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("add-button", this.attachButton, true);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("add-button", this.attachButton, true);
    }
}
