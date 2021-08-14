import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import DialogTemplate from "./fixtures/dialog.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("dialog")) {
        const button1 = document.getElementById("button1")!;
        const dialog1 = document.getElementById("dialog1")!;

        button1.addEventListener("click", (e: MouseEvent) => {
            dialog1.hidden = false;
        });

        dialog1.addEventListener("dismiss", (e: Event) => {
            dialog1.hidden = true;
        });
    }
});

export default {
    title: "Dialog",
};

export const Dialog = () => DialogTemplate;
