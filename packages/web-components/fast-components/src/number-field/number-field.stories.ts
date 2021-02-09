import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import NumberFieldTemplate from "./fixtures/number-field.html";
import { FASTNumberField } from "./";

// Prevent tree-shaking
FASTNumberField;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("number-field")) {
        setFormCallback();
    }
});

function setFormCallback(): void {
    document.querySelectorAll(".form").forEach(el => {
        if (el instanceof HTMLFormElement) {
            el.onsubmit = event => {
                console.log(event, "event");
                event.preventDefault();
                const form: HTMLFormElement = document.forms["myForm"];

                console.log(form.elements["fname"].value, "value of input");
            };
        }
    });
}

export default {
    title: "Number Field",
};

export const NumberField = () => NumberFieldTemplate;
