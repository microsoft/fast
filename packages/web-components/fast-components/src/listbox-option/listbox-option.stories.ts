import "../design-system-provider";
import Examples from "./fixtures/base.html";
import "./index";

export default {
    title: "Option",
    decorators: [
        Story => `
            <fast-design-system-provider use-defaults>
                ${Story()}
            </fast-design-system-provider>
        `,
    ],
};

export const ListboxOption = () => Examples;
