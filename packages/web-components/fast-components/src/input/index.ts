import {
    css,
    customElement,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralForegroundRestBehavior } from "../styles/index";
import {
    checkboxStyles,
    checkboxTemplate,
    checkedIndicatorTemplate,
    indeterminateIndicatorTemplate,
} from "./checkbox";
import { rangeInputStyles, rangeInputTemplate } from "./range";
import { textInputStyles, textInputTemplate } from "./text";

const styles = css`
    ${display("inline-flex")} :host {
        font-family: var(--body-font);
        flex-direction: column;
    }

    ::slotted(label) {
        display: block;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }
`;

@customElement({
    name: "fast-input",
    styles,
})
export class FastInput extends FASTElement {
    /**
     * The currently attached styles
     */
    @observable
    private attachedStyles: ElementStyles;
    private attachedStylesChanged(prev: ElementStyles, next: ElementStyles) {
        if (prev && next) {
            this.$fastController.removeStyles(prev);
        }

        if (next) {
            this.$fastController.addStyles(next);
        }
    }

    @observable
    private attachedTemplate: ElementViewTemplate = textInputTemplate;
    private attachedTemplateChanged(
        prev: ElementViewTemplate,
        next: ElementViewTemplate
    ) {
        if (next) {
            this.$fastController.template = next;
        }
    }

    @observable
    public controls: HTMLInputElement[];
    private controlsChanged() {
        const control = this.controls[0];

        if (control instanceof HTMLInputElement) {
            this.control = control;
        }
    }

    @observable
    public control: HTMLInputElement;
    public controlChanged(prev: HTMLInputElement | void, next: HTMLInputElement | void) {
        if (next instanceof HTMLInputElement) {
            this.type = next.type;

            if (this.type === "checkbox") {
                if (prev) {
                    const prevNotifier = Observable.getNotifier(prev);
                    prevNotifier.unsubscribe(this.indeterminateHandler, "indeterminate");
                }

                /**
                 * We need to get notified that indeterminate is changing
                 */
                const indeterminate = next.indeterminate;
                Observable.defineProperty(next, "indeterminate");

                const notifier = Observable.getNotifier(next);
                notifier.subscribe(this.indeterminateHandler, "indeterminate");

                next.indeterminate = indeterminate;
            }

            if (this.type === "checkbox" || this.type === "radio") {
                this.checked = next.checked;
            }
        }
    }

    @observable
    public checked: boolean = false;

    /**
     * Handle change events for radio and checkbox and set the checked state
     * @param e Event object
     */
    public checkedHandler(e: Event) {
        if (e.target instanceof HTMLInputElement) {
            this.checked = e.target.checked;
        }
    }

    @observable
    public indeterminate: boolean = false;

    private indeterminateHandler = {
        handleChange: (source, key) => {
            this.indeterminate = source[key];
        },
    };

    @observable
    public type: HTMLInputElement["type"];
    private typeChanged() {
        switch (this.type) {
            case "checkbox":
                this.attachedStyles = checkboxStyles;
                this.attachedTemplate = checkboxTemplate;
                break;
            case "range":
                this.attachedStyles = rangeInputStyles;
                this.attachedTemplate = rangeInputTemplate;
                break;
            case "text":
            case "number":
            case "password":
            case "email":
            case "url":
            case "tel":
            default:
                this.attachedStyles = textInputStyles;
                this.attachedTemplate = textInputTemplate;
                break;
        }
    }

    @observable
    public checkedIndicatorTemplate = checkedIndicatorTemplate;

    @observable
    public indeterminateIndicatorTemplate = indeterminateIndicatorTemplate;
}
