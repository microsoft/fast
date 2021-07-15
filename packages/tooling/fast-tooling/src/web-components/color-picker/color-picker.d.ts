import { ColorHSV, ColorRGBA64 } from "@microsoft/fast-colors";
import { FormAssociatedColorPicker } from "./color-picker.form-associated";
/**
 * This is currently experimental, any use of the color picker must include the following
 * imports and register with the DesignSystem
 *
 * import { fastTextField } from "@microsoft/fast-components";
 * import { DesignSystem } from "@microsoft/fast-foundation";
 * DesignSystem.getOrCreate().register(fastTextField());
 */
/**
 * Simple class for storing all of the color picker UI observable values.
 */
declare class ColorPickerUI {
    RGBColor: ColorRGBA64;
    HSVColor: ColorHSV;
    HueCSSColor: string;
    HuePosition: number;
    SatValTopPos: number;
    SatValLeftPos: number;
    AlphaPos: number;
    constructor(rgbColor: ColorRGBA64, hsvColor: ColorHSV);
}
/**
 * A Color Picker Custom HTML Element.
 *
 * @public
 */
export declare class ColorPicker extends FormAssociatedColorPicker {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * Indicates that this element should get focus after the page finishes loading. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus | autofocus HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    autofocus: boolean;
    private autofocusChanged;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    placeholder: string;
    private placeholderChanged;
    /**
     * Flag indicating that the color UI is visible.
     */
    open: boolean;
    /**
     * Flag indicating that the color UI is activily listening for mouse move and up events.
     */
    mouseActive: boolean;
    /**
     * Object containing all of the properties displayed in the color picker UI.
     */
    uiValues: ColorPickerUI;
    /**
     * A reference to the internal input element
     * @internal
     */
    control: HTMLInputElement;
    /**
     * A reference to the HTMLElement that is the current target of mouse move events.
     */
    private currentMouseTarget;
    /**
     * A string indicating which of the three graphical elements is the current mouse target. ['sv','h','a']
     */
    private currentMouseParam;
    /**
     * The ColorRGBA64 representation of the current color value.
     */
    private currentRGBColor;
    /**
     * The ColorHSV representation of the current color value.
     */
    private currentHSVColor;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * Handles the focus event. When the template has focus the color UI will be visable.
     * @internal
     */
    handleFocus(): void;
    /**
     * Handles the blur event. Hides the color UI when the template loses focus.
     * @internal
     */
    handleBlur(): void;
    /**
     * Handles the internal control's `input` event. This event is fired whenever a user types directly into the primary text field.
     * @internal
     */
    handleTextInput(): void;
    /**
     * Handles the mouse down event on the Sat/Val square and Hue and Alpha sliders. Sets the current targeted element and begins listening for mouse move events.
     * @param param ['sv','h','a'] - string specifying which color property is being modified with the mouse.
     * @param e - A reference to the mouse event.
     */
    handleMouseDown(param: string, e: MouseEvent): void;
    /**
     * Handles the mouse move event within the color UI. Is only called once the mouseActive is set to true.
     * @param e - Reference to the Mouse Event
     */
    handleMouseMove(e: MouseEvent): void;
    /**
     * Handles the mouse up event within the color UI. Disables listening for mouse move events.
     * @param e - Reference to the Mouse Event
     */
    handleMouseUp(e: MouseEvent): void;
    /**
     * Handles changes to any of the color property text inputs typed by the user.
     * @param param ['r','g','b','a','h','s','v'] - String specifying which color value is being modified.
     * @param e - Reference to the event.
     */
    handleTextValueInput(param: string, e: Event): void;
    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    handleChange(): void;
    /**
     * Determines if a number value is within the valid range for an R, G, or B color channel.
     * @param val - Number to be evaluated.
     */
    private isValidRGB;
    /**
     * Determines if a number value is within the valid range for the alpha channel.
     * @param val - Number to be evaluated.
     */
    private isValidAlpha;
    /**
     * Determines if a number value is within the valid range for the saturation or value color channels.
     * @param val - Number to be evaluated.
     */
    private isValidSaturationValue;
    /**
     * Determines if a number value is within the valid range for the hue color channel.
     * @param val - Number to be evaluated.
     */
    private isValidHue;
    /**
     * Checks if input is a valid CSS color.
     * After placing an invalid css color value into a color style property the value will be an empty string when read back.
     * @internal
     */
    private isValideCSSColor;
    /**
     * Update the current color values to a new HSV color.
     * @param hue The new Hue value.
     * @param sat The new saturation value.
     * @param val The new Value value.
     */
    private updateHSV;
    /**
     * Update the current color values based on the mouse position over one of the three UI elements (hue, saturation/value, or alpha).
     * @param pageX The pageX position of the mouse.
     * @param pageY The pageY position of the mouse.
     */
    private updateFromMouseEvent;
    /**
     * Update the UI values with the current color. This updates the position of the indicators over the Sat/Val, Hue and Alpha elements
     * and the values in all of the text fields at once.
     * @param updateValue - Flag to trigger updating of the main text field value and emitting the change event.
     */
    private updateUIValues;
}
export {};
