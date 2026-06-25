import { expect } from "chai";
import "./debug.js";
import type { FASTGlobal } from "./interfaces.js";

declare const FAST: FASTGlobal;

describe("The debug module", () => {
    let keyBase = 1111111111;

    context("when sending errors", () => {
        it("expect known error message from known error code", () => {
            const key = keyBase++;
            const message = "Test Message.";
            const messageLookup = {
                [key]: message
            };

            FAST.addMessages(messageLookup);

            const error = FAST.error(key);
            expect(error.message).equal(message);
        });

        it("expect unknown error message from unknown error code", () => {
            const error = FAST.error(10);
            expect(error.message).equal("Unknown Error");
        });

        it("formats error messages with interpolated values", () => {
            const key = keyBase++;
            const message = "${greeting}. ${question} My name is FAST.";
            const messageLookup = {
                [key]: message
            };

            FAST.addMessages(messageLookup);

            const error = FAST.error(key, { greeting: "Hello", question: "What is your name?" });
            expect(error.message).equal("Hello. What is your name? My name is FAST.");
        });
    });
});
