import "../design-system-provider";
import "../listbox";
import "../listbox-option";
import Examples from "./fixtures/base.html";
import "./index";

export default {
    title: "Select",
    decorators: [
        Story => `
            <fast-design-system-provider use-defaults>
                ${Story()}
            </fast-design-system-provider>
        `,
    ],
};

export const Select = () => Examples;
