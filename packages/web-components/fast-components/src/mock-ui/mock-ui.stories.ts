import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import MockUiTemplate from "./fixtures/mock-ui.html";
import { FASTMockUi } from "./";
import { UnityHost } from "@microsoft/fast-foundation";

// Prevent tree-shaking
FASTMockUi;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("mock-ui")) {
        const unityInstance: HTMLElement | null = document.getElementById("unity-host-1");
        if (unityInstance === null) {
            return;
        }
        // TODO: hook up mock ui to unity host here

        unityInstance.setAttribute("content-enabled", "true");
    }
});

export default {
    title: "Mock Ui",
};

export const MockUi = () => MockUiTemplate;
