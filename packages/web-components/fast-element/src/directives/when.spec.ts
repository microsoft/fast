import { expect } from "chai";
import { when } from "./when";
import { html } from "../template";
import { Binding, defaultExecutionContext } from "../observation/observable";

describe("The 'when' template function", () => {
    it("returns an expression", () => {
        const expression = when(() => true, html`test`);
        expect(typeof expression).to.equal("function");
    });

    context("expression", () => {
        const scope = {};
        const template = html`template1`;

        it("returns a template when the condition is true", () => {
            const expression = when(() => true, template) as Binding;
            const result = expression(scope, defaultExecutionContext);
            expect(result).to.equal(template);
        });

        it("returns null when the condition is false", () => {
            const expression = when(() => false, template) as Binding;
            const result = expression(scope, defaultExecutionContext);
            expect(result).to.equal(null);
        });

        it("evaluates a template expression to get the template, if provided", () => {
            const expression = when(
                () => true,
                () => template
            ) as Binding;
            const result = expression(scope, defaultExecutionContext);
            expect(result).to.equal(template);
        });
    });
});
