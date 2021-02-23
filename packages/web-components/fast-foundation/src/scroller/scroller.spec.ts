import { customElement } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { Scroller, ScrollerTemplate as template } from "./index";

@customElement({
    name: "fast-number-field",
    template,
})
class FASTScroller extends Scroller {}

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTScroller>(
        "fast-scroller"
    );

    return { element, connect, disconnect, parent };
}

describe("Scroller", () => {
});
