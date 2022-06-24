import { expect } from "chai";
import { Badge, badgeTemplate as template } from "./index.js";
import { fixture } from "../testing/fixture.js";

const FASTBadge = Badge.compose({
    baseName: "badge",
    template
})

async function setup() {
    const { element, connect, disconnect } = await fixture(FASTBadge());

    return { element, connect, disconnect };
}

describe("Badge", () => {
    it("should apply the 'circular' class when the attribute is set", async () => {
        const { element, connect, disconnect } = await setup();

        element.circular = true;

        await connect();

        expect(
            element.classList.contains("circular")
        ).true;

        await disconnect();
    });
});
