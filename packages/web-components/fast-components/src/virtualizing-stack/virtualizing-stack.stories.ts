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
        <!-- <image
            style="
                height:100%;
                width:100%;
            "
            src="https://source.unsplash.com/random/300x200"
        ></image> -->
        <div style="margin: 10px;">
            ${x => x.value}
        </div>
        <fast-skeleton
            style="border-radius: 4px;  height: 50px; margin:10px; width:auto;"
            shape="rect"
            shimmer
        ></fast-skeleton>
    </fast-card>
`;

const gridItemTemplate = html`
    <div
        style="
            contain: strict;
            height:100px;
            width:100px;
            grid-row: 1;
            grid-column: ${(x, c) => c.index + c.parent.virtualizedIndexOffset};
        "
    >
        <image
            style="
                background: olive;
                height:100%;
                width:100%;
            "
            src="${x => x.url}"
        ></image>
    </div>
`;

const rowItemTemplate = html`
    <fast-virtualizing-stack
        orientation="horizontal"
        item-span="100"
        viewport-buffer="200"
        :viewportElement="${(x, c) => c.parent.viewportElement}"
        :itemTemplate="${gridItemTemplate}"
        :items="${x => x.items}"
        style="
            contain: none;
            display: block;
            height:100%;
            width:100%;
            grid-row: ${(x, c) => c.index + c.parent.virtualizedIndexOffset};
            grid-column: 1;
        "
    ></fast-virtualizing-stack>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        const data = newDataSet(100000, 1);

        const gridData: object[] = [];

        for (let i = 1; i <= 100; i++) {
            gridData.push({
                items: newDataSet(100, i),
            });
        }

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

        const stackGrid = document.getElementById(
            "stackgrid"
        ) as FoundationVirtualizingStack;
        // stackGrid.viewportElement = document.getElementById(
        //     "gridcontainer"
        // ) as HTMLElement;
        stackGrid.itemTemplate = rowItemTemplate;
        stackGrid.items = gridData;

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

function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${prefix}${i}`,
            url: `https://picsum.photos/200/300?random=${prefix * 1000 + i}`,
        });
    }
    return newData;
}

export default {
    title: "Virtualizing Stack",
};

export const VirtualizingStack = () => VirtualizingStackTemplate;
