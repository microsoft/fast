import { expect } from "chai";
import { FASTVirtualListItem, virtualListItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { DOM,html } from "@microsoft/fast-element";

const virtualListItemName = uniqueElementName();
FASTVirtualListItem.define({
    name: virtualListItemName,
    template: virtualListItemTemplate()
});

const listItemTemplate = html`
    <template
        title="${x => x.listItemContext.titleString} ${x => x.itemData.title}"
    >
    </template>
`;

interface customContext {
    titleString: string,
}

async function setup() {
    const { document, element, connect, disconnect} = await fixture<FASTVirtualListItem>(virtualListItemName);

    const myContext: customContext = {
        titleString: "test custom context:"
    }

    element.listItemContentsTemplate = listItemTemplate,
    element.itemIndex = 1;
    element.itemData = { title: "test title"};

    return { element, connect, disconnect };
}

describe("VirtualListItem", () => {
    it("should render the provided template and populate bindings", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("title")).to.equal("test custom context: test title");

        await disconnect();
    });
});
