import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import MockUiTemplate from "./fixtures/mock-ui.html";
import { FASTMockUi } from "./";
import { UnityHost, MockUi } from "@microsoft/fast-foundation";

// Prevent tree-shaking
FASTMockUi;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("mock-ui")) {
        const unityInstance: HTMLElement | null = document.getElementById("unity-host-1");
        const mockUIInstance: HTMLElement | null = document.getElementById(
            "mock-ui-default"
        );
        if (unityInstance === null || mockUIInstance === null) {
            return;
        }

        // TODO
        // (unityInstance as UnityHost).subscribeEvent("addButton", (mockUIInstance as MockUi).addButton);

        (unityInstance as UnityHost).contentEnabled = true
    }
});

export default {
    title: "Mock Ui",
};

export const base = () => MockUiTemplate;
