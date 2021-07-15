import { Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
/**
 * An Radio Group Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radiogroup | ARIA radiogroup }.
 *
 * @public
 */
export declare class RadioGroup extends FoundationElement {
    /**
     * When true, the child radios will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    private disabledChanged;
    /**
     * The name of the radio group. Setting this value will set the name value
     * for all child radio elements.
     *
     * @public
     * @remarks
     * HTML Attribute: name
     */
    name: string;
    protected nameChanged(): void;
    /**
     * The value of the checked radio
     *
     * @public
     * @remarks
     * HTML Attribute: value
     */
    value: string;
    protected valueChanged(): void;
    /**
     * The orientation of the group
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation: Orientation;
    childItems: HTMLElement[];
    /**
     * @internal
     */
    slottedRadioButtons: HTMLElement[];
    private slottedRadioButtonsChanged;
    private selectedRadio;
    private focusedRadio;
    private direction;
    private get parentToolbar();
    private get isInsideToolbar();
    private get isInsideFoundationToolbar();
    /**
     * @internal
     */
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupRadioButtons;
    private radioChangeHandler;
    private moveToRadioByIndex;
    private moveRightOffGroup;
    private moveLeftOffGroup;
    /**
     * @internal
     */
    focusOutHandler: (e: FocusEvent) => boolean | void;
    /**
     * @internal
     */
    clickHandler: (e: MouseEvent) => void;
    private shouldMoveOffGroupToTheRight;
    private shouldMoveOffGroupToTheLeft;
    private checkFocusedRadio;
    private moveRight;
    private moveLeft;
    /**
     * keyboard handling per https://w3c.github.io/aria-practices/#for-radio-groups-not-contained-in-a-toolbar
     * navigation is different when there is an ancestor with role='toolbar'
     *
     * @internal
     */
    keydownHandler: (e: KeyboardEvent) => boolean | void;
}
