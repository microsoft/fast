import "../design-system-provider";
import "../listbox-option";
import "./index";
import Base from "./fixtures/base.html";

export default {
    title: "Listbox",
    decorators: [
        Story => `
            <fast-design-system-provider use-defaults>
                ${Story()}
            </fast-design-system-provider>
        `,
    ],
};

export const Listbox = () => Base;
