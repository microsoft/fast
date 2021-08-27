import { html } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { VirtualizingStack as FoundationVirtualingStack } from "@microsoft/fast-foundation";
import VirtualizingStackTemplate from "./fixtures/base.html";
import "./index";

let defaultStackElement: FoundationVirtualingStack;

const imageItemTemplate = html`
    <image height="100px" width="120px" src="${x => x}"></image>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    defaultStackElement = document.getElementById(
        "default-stack"
    ) as FoundationVirtualingStack;

    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        defaultStackElement.itemTemplate = imageItemTemplate;
        defaultStackElement.itemHeight = 100;
        defaultStackElement.items = newDataSet(100000);
    }
});

function newDataSet(rowCount: number): string[] {
    const newData: string[] = [];
    for (let i = 0; i <= rowCount; i++) {
        newData.push(`https://via.placeholder.com/120x100/414141/?text=${i + 1}`);
    }
    return newData;
}

export default {
    title: "Virtualizing Stack",
};

export const VirtualizingStack = () => VirtualizingStackTemplate;
