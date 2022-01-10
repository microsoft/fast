import {
    attr,
    css,
    customElement,
    html,
    observable,
    ref,
    slotted,
} from "@microsoft/fast-element";
import { FoundationElement, Slider, TextField } from "@microsoft/fast-foundation";
import {
    densityComponentHorizontalAdjustmentUnits,
    densityComponentHorizontalAdjustmentUnitsCumulative,
    densityComponentHorizontalOuterInverse,
    densityComponentHorizontalOuterValue,
    densityComponentVerticalAdjustmentUnits,
    densityComponentVerticalAdjustmentUnitsCumulative,
    densityComponentVerticalOuterInverse,
    densityComponentVerticalOuterValue,
} from "../../styles/density";
import Examples from "./fixtures/density.html";

@customElement({
    name: "density-example",
    template: html<DensityExample>`
        <template id="level-${x => x.level}">
            <div class="root">
                <div style="display: flex; align-items: flex-start;">
                    <div style="display: flex; flex-direction: column;">
                        <fast-slider
                            ${ref("slider")}
                            min="-4"
                            max="4"
                            value="${x => x.value}"
                        >
                            <fast-slider-label position="-4">
                                -4
                            </fast-slider-label>
                            <fast-slider-label position="-2"></fast-slider-label>
                            <fast-slider-label position="0">
                                0
                            </fast-slider-label>
                            <fast-slider-label position="2"></fast-slider-label>
                            <fast-slider-label position="4">
                                4
                            </fast-slider-label>
                        </fast-slider>

                        <dl>
                            <dt>Adjustment units (H, V)</dt>
                            <dd ${ref("adjustmentUnitsH")}></dd>
                            <dd ${ref("adjustmentUnitsV")}></dd>
                            <dt>Padding (H, V)</dt>
                            <dd ${ref("paddingH")}></dd>
                            <dd ${ref("paddingV")}></dd>
                            <dt>Input height</dt>
                            <dd ${ref("inputHeight")}></dd>
                        </dl>
                    </div>

                    <fast-text-field value="Hello" ${ref("textField")}>
                        <svg
                            slot="start"
                            width="20"
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.26 4.6a5.21 5.21 0 0 1 9.03 5.22l-.2.34a.5.5 0 0 1-.67.19l-3.47-2-1.93 3.38c1.34.4 2.5 1.33 3.31 2.52h-.09c-.34 0-.66.11-.92.31A4.9 4.9 0 0 0 9.5 12.5a4.9 4.9 0 0 0-3.82 2.06 1.5 1.5 0 0 0-1.01-.3 5.94 5.94 0 0 1 5.31-2.74l2.1-3.68-3.83-2.2a.5.5 0 0 1-.18-.7l.2-.33Zm.92.42 1.7.98.02-.02a8.08 8.08 0 0 1 3.27-2.74 4.22 4.22 0 0 0-4.99 1.78ZM14 7.8c.47-.82.7-1.46.77-2.09a5.8 5.8 0 0 0-.06-1.62 6.96 6.96 0 0 0-2.95 2.41L14 7.8Zm.87.5 1.61.93a4.22 4.22 0 0 0-.74-5.02c.07.56.09 1.1.02 1.63-.1.79-.38 1.56-.89 2.46Zm-9.63 7.3a.5.5 0 0 0-.96.03c-.17.7-.5 1.08-.86 1.3-.38.23-.87.32-1.42.32a.5.5 0 0 0 0 1c.64 0 1.33-.1 1.94-.47.34-.2.64-.5.88-.87a2.96 2.96 0 0 0 4.68-.01 2.96 2.96 0 0 0 4.74-.06c.64.9 1.7 1.41 2.76 1.41a.5.5 0 1 0 0-1c-.98 0-1.96-.64-2.29-1.65a.5.5 0 0 0-.95 0 1.98 1.98 0 0 1-3.79.07.5.5 0 0 0-.94 0 1.98 1.98 0 0 1-3.8-.08Z"
                            />
                        </svg>
                        <fast-button slot="end" class="fill" appearance="accent">
                            <svg
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.26 4.6a5.21 5.21 0 0 1 9.03 5.22l-.2.34a.5.5 0 0 1-.67.19l-3.47-2-1.93 3.38c1.34.4 2.5 1.33 3.31 2.52h-.09c-.34 0-.66.11-.92.31A4.9 4.9 0 0 0 9.5 12.5a4.9 4.9 0 0 0-3.82 2.06 1.5 1.5 0 0 0-1.01-.3 5.94 5.94 0 0 1 5.31-2.74l2.1-3.68-3.83-2.2a.5.5 0 0 1-.18-.7l.2-.33Zm.92.42 1.7.98.02-.02a8.08 8.08 0 0 1 3.27-2.74 4.22 4.22 0 0 0-4.99 1.78ZM14 7.8c.47-.82.7-1.46.77-2.09a5.8 5.8 0 0 0-.06-1.62 6.96 6.96 0 0 0-2.95 2.41L14 7.8Zm.87.5 1.61.93a4.22 4.22 0 0 0-.74-5.02c.07.56.09 1.1.02 1.63-.1.79-.38 1.56-.89 2.46Zm-9.63 7.3a.5.5 0 0 0-.96.03c-.17.7-.5 1.08-.86 1.3-.38.23-.87.32-1.42.32a.5.5 0 0 0 0 1c.64 0 1.33-.1 1.94-.47.34-.2.64-.5.88-.87a2.96 2.96 0 0 0 4.68-.01 2.96 2.96 0 0 0 4.74-.06c.64.9 1.7 1.41 2.76 1.41a.5.5 0 1 0 0-1c-.98 0-1.96-.64-2.29-1.65a.5.5 0 0 0-.95 0 1.98 1.98 0 0 1-3.79.07.5.5 0 0 0-.94 0 1.98 1.98 0 0 1-3.8-.08Z"
                                />
                            </svg>
                        </fast-button>
                    </fast-text-field>
                </div>

                <slot ${slotted("defaultSlottedNodes")}></slot>
            </div>
        </template>
    `,
    styles: css`
        .root {
            padding: 20px;
        }

        svg[width="16"],
        svg[width="20"] {
            margin: -2px;
        }

        svg[width="32"] {
            margin: -3px;
        }

        fast-slider {
            margin-bottom: 20px;
            width: 150px;
        }

        fast-button.fill {
            border-start-start-radius: 0;
            border-end-start-radius: 0;
            margin-top: calc(${densityComponentVerticalOuterInverse} * 1px);
            margin-bottom: calc(${densityComponentVerticalOuterInverse} * 1px);
            margin-right: calc(${densityComponentHorizontalOuterInverse} * 1px);
        }

        fast-text-field::part(root) {
            border-start-end-radius: 7px;
            border-end-end-radius: 7px;
        }
    `,
})
class DensityExample extends FoundationElement {
    @attr level = "x";

    @attr value = 0;

    /**
     * @internal
     */
    public slider: Slider;

    /**
     * @internal
     */
    public textField: TextField;

    /**
     * @internal
     */
    public adjustmentUnitsH: HTMLElement;

    /**
     * @internal
     */
    public adjustmentUnitsV: HTMLElement;

    /**
     * @internal
     */
    public paddingH: HTMLElement;

    /**
     * @internal
     */
    public paddingV: HTMLElement;

    /**
     * @internal
     */
    public inputHeight: HTMLElement;

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        densityComponentHorizontalAdjustmentUnitsCumulative.subscribe(
            {
                handleChange: this.handleTokenChange.bind(this),
            },
            this
        );
        densityComponentVerticalAdjustmentUnitsCumulative.subscribe(
            {
                handleChange: this.handleTokenChange.bind(this),
            },
            this
        );
        densityComponentHorizontalOuterValue.subscribe(
            {
                handleChange: this.handleTokenChange.bind(this),
            },
            this
        );
        densityComponentVerticalOuterValue.subscribe(
            {
                handleChange: this.handleTokenChange.bind(this),
            },
            this
        );
        this.handleTokenChange();

        if (this.slider) {
            this.slider.addEventListener("change", (e: Event) => {
                console.log(
                    `density: setting adjustment for ${this.level}, value ${this.slider.value}`
                );
                densityComponentHorizontalAdjustmentUnits.setValueFor(
                    this,
                    new Number(this.slider.value).valueOf()
                );
                densityComponentVerticalAdjustmentUnits.setValueFor(
                    this,
                    new Number(this.slider.value).valueOf()
                );
            });
            this.slider.dispatchEvent(new CustomEvent("change"));
        }
    }

    private handleTokenChange() {
        this.adjustmentUnitsH.innerText = densityComponentHorizontalAdjustmentUnitsCumulative
            .getValueFor(this)
            .toString();
        this.adjustmentUnitsV.innerText = densityComponentVerticalAdjustmentUnitsCumulative
            .getValueFor(this)
            .toString();
        this.paddingH.innerText = densityComponentHorizontalOuterValue
            .getValueFor(this)
            .toString();
        this.paddingV.innerText = densityComponentVerticalOuterValue
            .getValueFor(this)
            .toString();
        setTimeout(() => {
            this.inputHeight.innerText = this.textField.offsetHeight.toString();
        }, 200);
    }
}

export default {
    title: "Design System/Density",
};

export const Density = () => Examples;
