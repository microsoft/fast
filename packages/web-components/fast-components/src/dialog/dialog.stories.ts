import { Dialog } from "@microsoft/fast-foundation";
import DialogTemplate from "./fixtures/dialog.html";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("dialog")) {
        const button1 = document.getElementById("button1")!;
        const button2 = document.getElementById("button2")!;
        const button3 = document.getElementById("button3")!;
        const button4 = document.getElementById("button4")!;

        const dialog1 = document.getElementById("dialog1")!;
        const dialog2 = document.getElementById("dialog2")!;
        const dialog3 = document.getElementById("dialog3")!;
        const dialog4 = document.getElementById("dialog4")!;

        button1.addEventListener("click", (e: MouseEvent) => {
            dialog1.hidden = false;
        });

        button2.addEventListener("click", (e: MouseEvent) => {
            dialog2.hidden = false;
        });

        button3.addEventListener("click", (e: MouseEvent) => {
            dialog3.hidden = false;
        });

        button4.addEventListener("click", (e: MouseEvent) => {
            dialog4.hidden = false;
        });

        dialog1.addEventListener("dismiss", (e: Event) => {
            dialog1.hidden = true;
        });

        dialog2.addEventListener("dismiss", (e: Event) => {
            dialog2.hidden = true;
        });

        dialog3.addEventListener("dismiss", (e: Event) => {
            dialog3.hidden = true;
        });

        dialog4.addEventListener("dismiss", (e: Event) => {
            dialog4.hidden = true;
        });

        (dialog2 as Dialog).tabQueueStart = document.getElementById("starttabqueue2")!;
        (dialog2 as Dialog).tabQueueEnd = document.getElementById("endtabqueue2")!;

        (dialog3 as Dialog).tabQueueStart = () => {
            return document.getElementById("starttabqueue3")!;
        };
        (dialog3 as Dialog).tabQueueEnd = () => {
            return document.getElementById("endtabqueue3")!;
        };
    }
});

export default {
    title: "Dialog",
};

export const FastDialog = () => DialogTemplate;
