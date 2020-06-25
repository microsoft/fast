import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import MockUiTemplate from "./fixtures/mock-ui.html";
import { FASTMockUi } from "./";

// Prevent tree-shaking
FASTMockUi;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("mock-ui")) {
        const mockUiInstance: HTMLElement | null = document.getElementById(
            "mock-ui-default"
        );
        if (mockUiInstance === null) {
            return;
        }
        // const gameInstance = UnityLoader.instantiate("mock-ui-default", "build/ActiveBackground.json");
    }
});

export default {
    title: "Mock Ui",
};

export const MockUi = () => MockUiTemplate;
