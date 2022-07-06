import { expect } from "chai";
import { FASTDataListItem, dataListItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { DOM,html } from "@microsoft/fast-element";

const DataListItemName = uniqueElementName();
FASTDataListItem.define({
    name: DataListItemName,
    template: dataListItemTemplate()
});

const listItemTemplate = html`
    <template
        title="${x => x.itemData.title}"
    >
    </template>
`;


async function setup() {
    const { document, element, connect, disconnect} = await fixture<FASTDataListItem>(DataListItemName);

    element.itemContentsTemplate = listItemTemplate,
    element.itemIndex = 1;
    element.itemData = { title: "test title"};

    return { element, connect, disconnect };
}

describe("DataListItem", () => {
    it("should render the provided template and populate bindings", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("title")).to.equal("test custom context: test title");

        await disconnect();
    });

    it("should set loadContent to true if no loadMode provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.loadContent).to.equal(true);

        await disconnect();
    });

});
