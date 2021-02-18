import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import { MgtPerson } from "@microsoft/mgt";
import PeoplePickerTemplate from "./fixtures/people-picker.html";
import { FASTPeoplePicker } from "./";
import { Providers, MockProvider } from "@microsoft/mgt-element";

// Prevent tree-shaking
FASTPeoplePicker;
FASTDesignSystemProvider;
MgtPerson;

Providers.globalProvider = new MockProvider(true);

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("people-picker")) {
    }
});

export default {
    title: "People picker",
};

export const PeoplePicker = () => PeoplePickerTemplate;
