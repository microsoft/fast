import { html } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { Orientation } from "@microsoft/fast-web-utilities";
import { VirtualizingStack as FoundationVirtualizingStack } from "@microsoft/fast-foundation";
import VirtualizingStackTemplate from "./fixtures/base.html";
import "./index";

const imageItemTemplate = html`
    <fast-card
        style="
            background: olive;
            height:100%;
            width:100%;
            grid-row: ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
            grid-column: ${(x, c) =>
            c.parent.orientation === Orientation.horizontal
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
        "
    >
        <image
            style="
                height:100%;
                width:100%;
            "
            src="${x => x.url}"
        ></image>
    </fast-card>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        const data = newDataSet(100000);

        const stackh1 = document.getElementById("stackh1") as FoundationVirtualizingStack;
        stackh1.itemTemplate = imageItemTemplate;
        stackh1.items = data;

        const stackh2 = document.getElementById("stackh2") as FoundationVirtualizingStack;
        stackh2.itemTemplate = imageItemTemplate;
        stackh2.items = data;

        const stackh3 = document.getElementById("stackh3") as FoundationVirtualizingStack;
        stackh3.itemTemplate = imageItemTemplate;
        stackh3.items = data;

        const stackh4 = document.getElementById("stackh4") as FoundationVirtualizingStack;
        stackh4.itemTemplate = imageItemTemplate;
        stackh4.items = data;

        const stackv1 = document.getElementById("stackv1") as FoundationVirtualizingStack;
        stackv1.itemTemplate = imageItemTemplate;
        stackv1.viewportElement = document.documentElement;
        stackv1.items = data;

        const stackv2 = document.getElementById("stackv2") as FoundationVirtualizingStack;
        stackv2.itemTemplate = imageItemTemplate;
        stackv2.items = data;

        const stackv3 = document.getElementById("stackv3") as FoundationVirtualizingStack;
        stackv3.itemTemplate = imageItemTemplate;
        stackv3.items = data;
        stackv3.startRegionSpan = 100;
        stackv3.endRegionSpan = 100;
    }
});

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            url: `https://via.placeholder.com/100x100/414141/?text=${i}`,
        });
    }
    return newData;
}

export default {
    title: "Virtualizing Stack",
};

export const VirtualizingStack = () => VirtualizingStackTemplate;
