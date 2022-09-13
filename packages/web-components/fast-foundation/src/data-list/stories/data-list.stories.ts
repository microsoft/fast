import { html } from "@microsoft/fast-element";
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
            ${x => x.itemData.title}
        </div>
        <div
            style="
                        height: 160px;
                        width:160px;
                        margin:10px 20px 10px 20px;
                        background-image: url('${x => x.itemData.url}');
                "
        ></div>
    </fast-card>
`;

const storyTemplate = html<DataListStoryArgs>`
    <fast-data-list
        :items="${newDataSet(100, 1)}"
        recycle="${x => x.recycle}"
        :listItemContentsTemplate="${listItemContentsTemplate}"
    ></fast-data-list>
`;

export default {
    title: "Data List",
    args: {},
    argTypes: {
        recycle: { control: { type: "boolean" } },
    },
} as DataListStoryMeta;

export const DataList = (args: DataListStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
