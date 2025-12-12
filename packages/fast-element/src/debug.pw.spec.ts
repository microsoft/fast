import { expect, test } from "@playwright/test";
import "./debug.js";
import type { FASTGlobal } from "./interfaces.js";

declare const FAST: FASTGlobal;

test.describe("The debug module", () => {
    let keyBase = 1111111111;

    test.describe("when sending errors", () => {
        test("expect known error message from known error code", async () => {
            const key = keyBase++;
            const message = "Test Message.";
            const messageLookup = {
                [key]: message,
            };

            FAST.addMessages(messageLookup);

            const error = FAST.error(key);
            expect(error.message).toBe(message);
        });

        test("expect unknown error message from unknown error code", async () => {
            const error = FAST.error(10);
            expect(error.message).toBe("Unknown Error");
        });

        test("formats error messages with interpolated values", async () => {
            const key = keyBase++;
            const message = "${greeting}. ${question} My name is FAST.";
            const messageLookup = {
                [key]: message,
            };

            FAST.addMessages(messageLookup);

            const error = FAST.error(key, {
                greeting: "Hello",
                question: "What is your name?",
            });
            expect(error.message).toBe("Hello. What is your name? My name is FAST.");
        });
    });
});
