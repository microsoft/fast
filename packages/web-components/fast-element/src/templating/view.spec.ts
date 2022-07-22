import { expect } from "chai";
import { Message } from "../interfaces.js";
import { ExecutionContext } from "../observation/observable.js";
import { FAST } from "../platform.js";
import { html } from "./template.js";

function startCapturingWarnings() {
    const currentWarn = FAST.warn;
    const list: { code: number, values?: Record<string, any> }[] = [];

    FAST.warn = function(code, values) {
        list.push({ code, values });
    }

    return {
        list,
        dispose() {
            FAST.warn = currentWarn;
        }
    };
}

describe(`The HTMLView`, () => {
    context("when binding hosts", () => {
        it("warns on class bindings when host not present", () => {
            const template = html`
                <template class="foo"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("className");
        });

        it("warns on style bindings when host not present", () => {
            const template = html`
                <template style="color: red"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("setAttribute");
        });

        it("warns on boolean bindings when host not present", () => {
            const template = html`
                <template ?disabled="${() => false}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("removeAttribute");
        });

        it("warns on property bindings when host not present", () => {
            const template = html`
                <template :myProperty="${() => false}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("myProperty");
        });

        it("warns on className bindings when host not present", () => {
            const template = html`
                <template :className="${() => "test"}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("className");
        });

        it("warns on event bindings when host not present", () => {
            const template = html`
                <template @click="${() => void 0}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("addEventListener");
        });
    });
});
