import { html, when } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDataList as FoundationDataList } from "../data-list.js";

type DataListStoryArgs = Args & FoundationDataList;
type DataListStoryMeta = Meta<DataListStoryArgs>;

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

const listItemContentsTemplate = html`
    <fast-card>
        <div
            style="
                margin: 5px 20px 0 20px;
                color: white;
            "
        >
            ${x => x.listItemContext.titleString} ${x => x.itemData.title}
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

const storyTemplate = html<DataListStoryArgs>`
    <fast-data-list
        :items="${newDataSet(100, 1)}"
        orientation="${x => x.orientation}"
        recycle="${x => x.recycle}"
        idle-load-mode="${x => x.idleLoadMode}"
        idle-callback-timeout="${x => x.idleCallbackTimeout}"
        list-item-load-mode="${x => x.listItemLoadMode}"
        :listItemContentsTemplate="${listItemContentsTemplate}"
        :listItemContext="${{
            titleString: "title:",
        }}"
    ></fast-data-list>
`;

export default {
    title: "Data List",
    args: {
        itemSize: 100,
    },
    argTypes: {
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "select" },
        },
        recycle: { control: { type: "boolean" } },
        idleLoadMode: {
            options: ["enabled", "suspended"],
            control: { type: "select" },
        },
        idleCallbackTimeout: {
            control: { type: "text" },
        },
        listItemLoadMode: {
            options: ["manual", "immediate", "idle"],
            control: { type: "select" },
        },
    },
} as DataListStoryMeta;

export const DataList = (args: DataListStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
