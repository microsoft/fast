import { html, when } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDataList } from "../data-list.js";

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
            title: `item #${i}`,
            url: `https://picsum.photos/200/200?random=${prefix * 1000 + i}`,
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

const storyTemplate = html<StoryArgs<FASTDataList>>`
    <fast-data-list
        :sourceItems="${newDataSet(100, 1)}"
        orientation="${x => x.orientation}"
        recycle="${x => x.recycle}"
        idle-load-mode="${x => x.idleLoadMode}"
        idle-callback-timeout="${x => x.idleCallbackTimeout}"
        list-item-load-mode="${x => x.listItemLoadMode}"
        :itemContentsTemplate="${itemContentsTemplate}"
    ></fast-data-list>
`;

export default {
    title: "Data List",
    args: {
        itemLoadMode: "idle",
    },
    argTypes: {
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "select" },
        },
        recycle: { control: { type: "boolean" } },
        itemLoadMode: {
            options: ["idle", "immediate"],
            control: { type: "select" },
        },
        idleCallbackTimeout: {
            control: { type: "text" },
        },
    },
} as Meta<FASTDataList>;

export const DataList: Story<FASTDataList> = renderComponent(storyTemplate).bind({});

export const DataListHorizontal: Story<FASTDataList> = renderComponent(
    storyTemplate
).bind({});
DataListHorizontal.args = {
    orientation: "horizontal",
};
