import { html } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { VirtualizingStack as FoundationVirtualingStack } from "@microsoft/fast-foundation";
import VirtualizingStackTemplate from "./fixtures/base.html";
import "./index";

const imageItemTemplate = html`
    <fast-card
        style="
            height:100%;
            width:100%;
            grid-row:${(x, c) => c.index + 2}
        "
    >
        <image
            style="
                height:100px;
                width:120px;
            "
            src="${x => x.url}"
        ></image>
    </fast-card>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        const stack1 = document.getElementById("stack1") as FoundationVirtualingStack;

        stack1.itemTemplate = imageItemTemplate;
        stack1.viewportElement = document.documentElement;
        stack1.items = newDataSet(100000);

        const stack2 = document.getElementById("stack2") as FoundationVirtualingStack;

        stack2.itemTemplate = imageItemTemplate;
        stack2.items = newDataSet(100000);

        const stack3 = document.getElementById("stack3") as FoundationVirtualingStack;

        stack3.itemTemplate = imageItemTemplate;
        stack3.items = newDataSet(100000);
    }
});

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 0; i <= rowCount; i++) {
        newData.push({
            url: `https://via.placeholder.com/120x100/414141/?text=${i + 1}`,
        });
    }
    return newData;
}

export default {
    title: "Virtualizing Stack",
};

export const VirtualizingStack = () => VirtualizingStackTemplate;
