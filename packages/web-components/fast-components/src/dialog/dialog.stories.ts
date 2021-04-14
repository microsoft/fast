import { Dialog as FastDialog } from "@microsoft/fast-foundation";
import DialogTemplate from "./fixtures/dialog.html";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import "./index";

export default {
    title: "Dialog",
};

export const FastDialog = () => DialogTemplate;
