import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    ref,
} from "@microsoft/fast-element";
import { eventFocus, keyArrowLeft, keyArrowRight } from "@microsoft/fast-web-utilities";

export function registerComplexCell() {
    ComplexCell.define({
        name: "complex-cell",
        template: complexCellTemplate(),
        styles: complexCellStyles,
    });
}

export class ComplexCell extends FASTElement {
    public buttonA: HTMLButtonElement;
    public buttonB: HTMLButtonElement;

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener(eventFocus, this.handleFocus);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public handleFocus = (e: FocusEvent): void => {
        this.buttonA.focus();
    };

    public handleKeyDown = (e: KeyboardEvent): boolean => {
        if (e.key !== keyArrowLeft && e.key !== keyArrowRight) {
            return true;
        }
        if (e.target === this.buttonA) {
            this.buttonB.focus();
        } else {
            this.buttonA.focus();
        }
        return false;
    };
}

export function complexCellTemplate<T extends ComplexCell>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <fast-button
                ${ref("buttonA")}
                tabindex="-1"
                @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            >
                A
            </fast-button>
            <fast-button
                ${ref("buttonB")}
                tabindex="-1"
                @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            >
                B
            </fast-button>
        </template>
    `;
}

export const complexCellStyles = css`
    :host {
    }
`;
