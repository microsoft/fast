import { expect } from "chai";
import { FASTDataList, dataListTemplate } from "./index.js";
import { FASTDataListItem, dataListItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { html } from "@microsoft/fast-element";


const dataListItemName = uniqueElementName();
FASTDataListItem.define({
    name: dataListItemName,
    template: dataListItemTemplate()
});

const dataListName = uniqueElementName();
FASTDataList.define({
    name: dataListName,
    template: dataListTemplate({
        dataListItem: dataListItemName
    })
});

const itemTemplate = html`
    <div>
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
    const { document, element, connect, disconnect } = await fixture<FASTDataList>(dataListName);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("DataList", () => {
});
