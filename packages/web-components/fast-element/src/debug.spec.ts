import { expect } from "chai";
import "./debug.js";
import { FASTGlobal, Message } from "./interfaces.js";

declare const FAST: FASTGlobal;

describe("The debug module", () => {
    context("when sending errors", () => {
        it("expect known error message from known error code", () => {
            const error = FAST.error(Message.bindingInnerHTMLRequiresTrustedTypes);
            expect(error.message.length).greaterThan(0);
            expect(error.message).not.equal("Unknown Error");
        });

        it("expect unknown error message from unknown error code", () => {
            const error = FAST.error(10);
            expect(error.message).equal("Unknown Error");
        });
    });
});
