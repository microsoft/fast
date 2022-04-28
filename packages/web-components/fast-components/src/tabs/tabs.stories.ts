import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import Examples from "./fixtures/base.html";

function addItem(): void {
    const tabsElement = document.getElementById("addTabsExample");

    if (tabsElement?.children !== undefined) {
        const tab: any = document.createElement("fast-tab");
        const tabPanel: any = document.createElement("fast-tab-panel");
        tab.textContent = "Added tab";
        tabPanel.textContent = "Added panel";

        tabsElement?.appendChild(tab);
        tabsElement.insertBefore(tabPanel, tab);
    }
}

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase() === "tabs--tabs") {
        const button = document.getElementById("add-button") as HTMLElement;
        button.addEventListener("click", () => addItem());
    }
});

export default {
    title: "Tabs",
};

export const Tabs = () => Examples;
