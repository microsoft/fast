import { expect } from "chai";
import { VirtualListItem, VirtualListItemContext } from "./index";
import { fixture } from "../test-utilities/fixture";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, customElement, html } from "@microsoft/fast-element";
import { timeout } from "../test-utilities/timeout";

const FASTVirtualListItem = VirtualListItem.compose({
    baseName: "virtual-list-item"
})

const listItemTemplate = html`
    <template
        title="${x => x.listItemContext.titleString} ${x => x.itemData.title}"
    >
    </template>
`;

interface customContext extends VirtualListItemContext {
    titleString: string,
}


async function setup() {
    const { element, connect, disconnect } = await fixture([FASTVirtualListItem()]);

    const myContext: customContext = {
        listItemContentsTemplate: listItemTemplate,
        titleString: "test custom context:"
    }

    element.itemIndex = 1;
    element.itemData = { title: "test title"};
    element.listItemContext = myContext;

    return { element, connect, disconnect };
}

describe("VirtualListItem", () => {
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

    it("should set loadContent to false if loadMode is set to 'manual'", async () => {
        const { element, connect, disconnect } = await setup();

        element.listItemContext.loadMode = "manual";

        await connect();

        expect(element.loadContent).to.equal(false);

        await disconnect();
    });


    it("should set loadContent to false and then true if loadMode is set to 'idle'", async () => {
        const { element, connect, disconnect } = await setup();

        element.listItemContext.loadMode = "idle";
        VirtualListItem.idleCallbackQueue.idleCallbackTimeout = 0;

        await connect();

        expect(element.loadContent).to.equal(false);

        await DOM.nextUpdate();

        expect(element.loadContent).to.equal(true);

        await disconnect();
    });
});
