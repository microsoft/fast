import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import UnityHostTemplate from "./fixtures/unity-host.html";
import { FASTUnityHost } from "./";

// Prevent tree-shaking
FASTUnityHost;
FASTDesignSystemProvider;

export default {
    title: "Unity Host",
};

export const UnityHost = () => UnityHostTemplate;
