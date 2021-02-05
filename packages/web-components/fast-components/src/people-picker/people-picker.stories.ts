import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import PeoplePickerTemplate from "./fixtures/people-picker.html";
import { FASTPeoplePicker } from "./";
import { Providers, MockProvider } from "@microsoft/mgt-element";

// Prevent tree-shaking
FASTPeoplePicker;
FASTDesignSystemProvider;

Providers.globalProvider = new MockProvider(true);

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("people-picker")) {
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
    title: "People picker",
};

export const PeoplePicker = () => PeoplePickerTemplate;
