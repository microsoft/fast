import { html, ref } from "@microsoft/fast-element";
import { ColorPicker } from "./color-picker";

/**
 * The template for the color picker component.
 * @public
 */
export const ColorPickerTemplate = html<ColorPicker>`
    <template
        class="
            ${x => (x.readOnly ? "readonly" : "")}
        "
        @focus="${x => x.handleFocus()}"
        @blur="${x => x.handleBlur()}"
        @mousemove="${(x, c) => x.isMouseActive ? x.handleMouseMove(<MouseEvent>c.event) : null}"
        @mouseup="${(x, c) => x.isMouseActive ? x.handleMouseUp(<MouseEvent>c.event) : null}"
        style="--selectedColor-value: ${x => (x.value ? x.value : "transparent")}"
    >
        <div class="root ${x => (x.isOpen ? "open" : "")}" part="root">
            <fast-text-field
                class="control"
                part="control"
                id="control"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                :value="${x => x.value}"
                ${ref("control")}
            >
                <div slot="start" class="selectedColor"></div>
            </fast-text-field>
            <div class="colorUI">
                <div class="pickerContainer">
                    <div class="satLightPicker" 
                        style="background-color:${x => x.uiValues.HueCSSColor}"
                        @mousedown="${(x, c) => x.handleMouseDown('sv',<MouseEvent>c.event)}"
                    >
                        <div class="satLightLocation" style="left: ${x => x.uiValues.SatValLeftPos-2}%; top: ${x => x.uiValues.SatValTopPos-2}%"></div>
                    </div>
                    <div class="huePicker"
                        @mousedown="${(x, c) => x.handleMouseDown('h',<MouseEvent>c.event)}"
                    ><div class="hueLocation" style="left: ${x => x.uiValues.HuePosition-1}%"></div></div>
                    <div class="alphaPicker"
                        @mousedown="${(x, c) => x.handleMouseDown('a',<MouseEvent>c.event)}"
                    >
                        <div class="alphaMask" style="background-image: linear-gradient(to right, transparent, ${x => x.uiValues.HueCSSColor})"></div>
                        <div class="alphaLocation" style="left: ${x => x.uiValues.AlphaPos-1}%"></div>
                    </div>
                </div>
                <div class="inputContainer">
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('r', c.event)}"
                        :value="${x => Math.round(x.uiValues.RGBColor.r*255)}"
                    >
                        <span slot="start">R: </span>
                    </fast-text-field>
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('g', c.event)}"
                        :value="${x => Math.round(x.uiValues.RGBColor.g*255)}"
                    >
                        <span slot="start">G: </span>
                    </fast-text-field>
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('b', c.event)}"
                        :value="${x => Math.round(x.uiValues.RGBColor.b*255)}"
                    >
                        <span slot="start">B: </span>
                    </fast-text-field>

                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('h', c.event)}"
                        :value="${x => Math.round(x.uiValues.HSVColor.h)}"
                    >
                        <span slot="start">H: </span>
                    </fast-text-field>
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('s', c.event)}"
                        :value="${x => Math.round(x.uiValues.HSVColor.s*100)}"
                    >
                        <span slot="start">S: </span>
                    </fast-text-field>
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('v', c.event)}"
                        :value="${x => Math.round(x.uiValues.HSVColor.v*100)}"
                    >
                        <span slot="start">V: </span>
                    </fast-text-field>
                    <fast-text-field
                        maxLength="3"
                        size="3"
                        @input="${(x,c) => x.handleTextValueInput('a', c.event)}"
                        :value="${x => Math.round(x.uiValues.RGBColor.a*100)}"
                    >
                        <span slot="start">A: </span>
                    </fast-text-field>
                </div>
            </div>
        </div>
    </template>
`;
