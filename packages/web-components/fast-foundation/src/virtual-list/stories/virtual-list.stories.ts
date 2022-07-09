import { html, when } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTVirtualList as FoundationVirtualList } from "../virtual-list.js";

type VirtualListStoryArgs = Args & FoundationVirtualList;
type VirtualListStoryMeta = Meta<VirtualListStoryArgs>;

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
            title: `item #${i}`,
            url: `https://picsum.photos/200/200?random=${prefix * 1000 + i}`,
            itemSize: 100 + Math.floor(Math.random() * 300),
            itemCollapsedSize: 100,
        });
    }
    return newData;
}

const itemContentsTemplate = html`
    <fast-card>
        <div
            style="
                margin: 5px 20px 0 20px;
                color: white;
            "
        >
            ${x => x.itemData.title}
        </div>
        ${when(
            x => x.loadContent,
            html`
                <div
                    style="
                        height: 160px;
                        width:160px;
                        margin:10px 20px 10px 20px;
                        background-image: url('${x => x.itemData.url}');
                "
                ></div>
            `
        )}
        ${when(
            x => !x.loadContent,
            html`
                <div
                    style="
                    background: white;
                    opacity: 0.2;
                    height: 160px;
                    width:160px;
                    margin:10px 20px 10px 20px;
            "
                ></div>
            `
        )}
    </fast-card>
`;

const storyTemplate = html<VirtualListStoryArgs>`
    <fast-virtual-list
        :sourceItems="${newDataSet(5000, 1)}"
        :sizemap="${x => x.sizemap}"
        virtualization-enabled="${x => x.virtualizationEnabled}"
        viewport="${x => x.viewport}"
        item-size="${x => x.itemSize}"
        viewport-buffer="${x => x.viewportBuffer}"
        orientation="${x => x.orientation}"
        auto-update-mode="${x => x.autoUpdateMode}"
        recycle="${x => x.recycle}"
        auto-resize-items="${x => x.autoResizeItems}"
        idle-load-mode="${x => x.idleLoadMode}"
        idle-callback-timeout="${x => x.idleCallbackTimeout}"
        list-item-load-mode="${x => x.listItemLoadMode}"
        :itemContentsTemplate="${itemContentsTemplate}"
    ></fast-virtual-list>
`;

export default {
    title: "Virtual List",
    args: {
        itemSize: 100,
        itemLoadMode: "idle",
    },
    argTypes: {
        virtualizationEnabled: {
            control: { type: "boolean" },
        },
        viewport: {
            control: { type: "text" },
        },
        itemSize: {
            control: { type: "text" },
        },
        viewportBuffer: {
            control: { type: "text" },
        },
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "select" },
        },
        autoUpdateMode: {
            options: ["manual", "viewport", "auto"],
            control: { type: "select" },
        },
        recycle: { control: { type: "boolean" } },
        autoResizeItems: { control: { type: "boolean" } },
        itemLoadMode: {
            options: ["idle", "immediate"],
            control: { type: "select" },
        },
        idleCallbackTimeout: {
            control: { type: "text" },
        },
    },
} as VirtualListStoryMeta;

export const VirtualList = (args: VirtualListStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
