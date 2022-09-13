import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTDataList, dataListTemplate } from "./index.js";
import { FASTDataListItem, dataListItemTemplate } from "../index.js";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, html } from "@microsoft/fast-element";


const baseListItemName = uniqueElementName();
FASTDataListItem.define({
    name: baseListItemName,
    template: dataListItemTemplate()
});

const baseListName = uniqueElementName();
FASTDataList.define({
    name: baseListName,
    template: dataListTemplate({
        defaultListItem: baseListItemName
    })
});

const itemTemplate = html`
    <div
        style="
            height:100%;
            width:100%;
        "
    >
        ${x => x.value}
    </div>
`;

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: i,
        });
    }
    return newData;
}

async function setup() {
    const { document, element, connect, disconnect } = await fixture<FASTDataList>(baseListName);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("DataList", () => {
    it("should have a default 'itemTemplate'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemTemplate).to.not.be.empty;

        await disconnect();
    });
});
