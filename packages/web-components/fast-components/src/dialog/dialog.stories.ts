import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { Dialog as FoundationDialog } from "@microsoft/fast-foundation";
import DialogTemplate from "./fixtures/dialog.html";
import "./index.js";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("dialog")) {
        const button1 = document.getElementById("button1");
        const dialog1: FoundationDialog = document.getElementById(
            "dialog1"
        ) as FoundationDialog;

        if (button1 && dialog1) {
            button1.addEventListener("click", (e: MouseEvent) => {
                dialog1.hidden = false;
            });

            dialog1.addEventListener("dismiss", (e: Event) => {
                dialog1.hidden = true;
            });
        }

        const button2 = document.getElementById("button2");
        const dialog2: FoundationDialog = document.getElementById(
            "dialog2"
        ) as FoundationDialog;

        const shadowButton1: HTMLElement = document.createElement("fast-button");
        shadowButton1.textContent = "Shadow Button 1";
        dialog2.dialog.prepend(shadowButton1);

        const shadowNumberField: HTMLElement = document.createElement(
            "fast-number-field"
        );
        dialog2.dialog.prepend(shadowNumberField);

        const shadowButton2: HTMLButtonElement = document.createElement("button");
        shadowButton2.textContent = "Shadow Button 2";
        dialog2.dialog.appendChild(shadowButton2);

        if (button2 && dialog2) {
            button2.addEventListener("click", (e: MouseEvent) => {
                dialog2.hidden = false;
            });

            dialog2.addEventListener("dismiss", (e: Event) => {
                dialog2.hidden = true;
            });
        }
    }
});

export default {
    title: "Dialog",
};

export const Dialog = () => DialogTemplate;
