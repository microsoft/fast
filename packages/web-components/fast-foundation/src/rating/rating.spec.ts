import { expect } from "chai";
import { DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { ratingTemplate as template, Rating } from "./index";

const FASTRating= Rating.compose({
    baseName: "rating",
    template
})

async function setup() {
    const { element, connect, disconnect, parent } = await fixture(FASTRating());

    return { element, connect, disconnect };
}

describe("Rating", () => {

});
