import { ColorHSV, ColorRGBA64, hsvToRGB, parseColor, rgbToHSV } from "@microsoft/fast-colors";
import { attr, DOM, observable } from "@microsoft/fast-element";
import { isNullOrWhiteSpace } from "@microsoft/fast-web-utilities";
import { isNumber } from "util";
import { FormAssociatedColorPicker } from "./color-picker.form-associated";

/**
 * A Color Picker Custom HTML Element.
 *
 * @public
 */
export class ColorPicker extends FormAssociatedColorPicker {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
            this.validate();
        }
    }

    /**
     * Indicates that this element should get focus after the page finishes loading. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus | autofocus HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ mode: "boolean" })
    public autofocus: boolean;
    private autofocusChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.autofocus = this.autofocus;
            this.validate();
        }
    }

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;
    private placeholderChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * A reference to the internal input element
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * A reference to the internal input element
     * @internal
     */
    @observable
    public isOpen: boolean;

    public currentRGBColor: ColorRGBA64 = new ColorRGBA64(1,0,0);
    
    public currentHSVColor: ColorHSV = new ColorHSV(0,1,1);

    @observable
    public uiValues: ColorPickerUI = new ColorPickerUI(this.currentRGBColor, this.currentHSVColor);

    private updateUIValues(updateValue:boolean)
    {
        let newVal = new ColorPickerUI(this.currentRGBColor, this.currentHSVColor);
        this.uiValues = newVal;
        if(updateValue)
        {
            this.value = this.currentRGBColor.a != 1 ? this.currentRGBColor.toStringWebRGBA() : this.currentRGBColor.toStringHexRGB();
        }
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.isOpen = false;
        if(!isNullOrWhiteSpace(this.value))
        {
            this.currentRGBColor = parseColor(this.value);
        }
        else
        {
            this.currentRGBColor = new ColorRGBA64(1,0,0,1);
        }
        this.currentHSVColor = rgbToHSV(this.currentRGBColor);
        this.updateUIValues(false);

        this.proxy.setAttribute("type", "colorpicker");
        this.validate();

        if (this.autofocus) {
            DOM.queueUpdate(() => {
                this.focus();
            });
        }
    }

    /**
     * Handles the focus event
     * @internal
     */
    public handleFocus(): void {
        this.isOpen = true;
    }

    /**
     * Handles the focus event
     * @internal
     */
    public handleBlur(): void {
        this.isOpen = false;
    }

    /**
     * Handles the internal control's `input` event
     * @internal
     */
    public handleTextInput(): void {
        this.value = this.control.value;
        if(this.isValideCSSColor(this.value))
        {
            this.currentRGBColor = parseColor(this.value);
            this.currentHSVColor = rgbToHSV(this.currentRGBColor);
            this.updateUIValues(false);
        }
    }

    private isValideRGB(val: number): boolean
    {
        return val >= 0 && val <= 255;
    }

    private isValideAlpha(val: number): boolean
    {
        return val >= 0 && val <= 100;
    }

    private isValideSatVal(val: number): boolean
    {
        return val >= 0 && val <= 100;
    }

    private isValideHue(val: number): boolean
    {
        return val >= 0 && val <= 359;
    }

    private updateHSV(hue:number, sat:number, val:number)
    {
        this.currentHSVColor = new ColorHSV(hue, sat, val);
        this.currentRGBColor = hsvToRGB(this.currentHSVColor,this.currentRGBColor.a);
        this.updateUIValues(true);
    }

    public handleTextValueInput(param:string,e:Event)
    {
        const inputVal = (<HTMLInputElement>e.composedPath()[0]).value;
        if(isNullOrWhiteSpace(inputVal) || Number.isNaN(inputVal))
        {
            return;
        }
        let newVal: number = parseInt(inputVal);

        if(['r','g','b','a'].includes(param))
        {
            if( (param != 'a' && this.isValideRGB(newVal)) || ( param == 'a' && this.isValideAlpha(newVal) ))
            {
                this.currentRGBColor = new ColorRGBA64(
                    param == 'r' ? newVal / 255 : this.currentRGBColor.r,
                    param == 'g' ? newVal / 255 : this.currentRGBColor.g,
                    param == 'b' ? newVal / 255 : this.currentRGBColor.b,
                    param == 'a' ? newVal / 100 : this.currentRGBColor.a
                );
                this.currentHSVColor = rgbToHSV(this.currentRGBColor);
                this.updateUIValues(true);
            }
        }
        else if(['h','s','v'].includes(param))
        {
            if( (param != 'h' && this.isValideSatVal(newVal)) || ( param == 'h' && this.isValideHue(newVal) ))
            {
                this.updateHSV(
                    param == 'h' ? newVal : this.currentHSVColor.h,
                    param == 's' ? newVal / 100 : this.currentHSVColor.s,
                    param == 'v' ? newVal / 100 : this.currentHSVColor.v
                );
            }
        }
    }

    @observable
    public isMouseActive:boolean = false;
    private currentMouseTarget:HTMLElement = null;
    private currentMouseParam:string;

    public handleMouseMove(e:MouseEvent)
    {
        this.updateFromMouseEvent(e.pageX, e.pageY);
    }

    public handleMouseUp(e:MouseEvent)
    {
        this.currentMouseTarget = null;
        this.currentMouseParam = null;
        this.isMouseActive = false;
    }

    public handleMouseDown(param:string, e:MouseEvent)
    {
        this.currentMouseTarget = (<HTMLElement>e.composedPath()[0]);
        this.currentMouseParam = param;
        this.updateFromMouseEvent(e.pageX, e.pageY);
        this.isMouseActive = true;
    }

    private updateFromMouseEvent(pageX:number, pageY:number)
    {
        let pos:DOMRect = this.currentMouseTarget.getBoundingClientRect();
        var x = pageX - pos.left;
		var y = pageY - pos.top;
		var width = pos.width;
        var height = pos.height;

		if (x > width) x = width;
		if (y > height) y = height;
		if (x < 0) x = 0;
		if (y < 0) y = 0;

        if(this.currentMouseParam == 'h')
        {
            let hue:number = ((359 * x) / width);
            this.updateHSV(hue, this.currentHSVColor.s, this.currentHSVColor.v);
        }
        else if(this.currentMouseParam == 'sv')
        {
            let value:number = Math.round(100 - (y * 100 / height))/100;
            let saturation:number = Math.round(x * 100 / width)/100;
            this.updateHSV(this.currentHSVColor.h, saturation, value);
        }
        else if(this.currentMouseParam == 'a')
        {
            let alpha:number = Math.round(x * 100 / width) / 100;
            this.currentRGBColor = new ColorRGBA64(this.currentRGBColor.r, this.currentRGBColor.g, this.currentRGBColor.b, alpha);
            this.updateUIValues(true);
        }
    }

    /**
     * Checks if input is a valid CSS color.
     * After placing an invalid css color value into a color style property the value will be an empty string when read back.
     * @internal
     */
    private isValideCSSColor(testValue:string): boolean {
        this.proxy.style.backgroundColor = "";
        this.proxy.style.backgroundColor = testValue;
        return this.proxy.style.backgroundColor!="" ? true : false;
    }
    
    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    public handleChange(): void {
        this.$emit("change");
    }
}

class ColorPickerUI
{
    public RGBColor: ColorRGBA64;
    public HSVColor: ColorHSV;
    public HueCSSColor: string;
    public HuePosition: number;
    public SatValTopPos: number;
    public SatValLeftPos: number;
    public AlphaPos: number;

    constructor(rgbColor:ColorRGBA64, hsvColor:ColorHSV)
    {
        this.RGBColor = rgbColor;
        this.HSVColor = hsvColor;
        let temp = new ColorHSV(this.HSVColor.h,1,1);
        this.HueCSSColor = hsvToRGB(temp).toStringHexRGB();
        this.HuePosition = (this.HSVColor.h / 360) * 100;
        this.SatValLeftPos = this.HSVColor.s * 100;
        this.SatValTopPos = 100 - (this.HSVColor.v * 100);
        this.AlphaPos = this.RGBColor.a * 100;
    }

}