import "../design-system-provider";
import Examples from "./fixtures/base.html";
import "./index";

export default {
    title: "Listbox Option",
    decorators: [
        (Story): string => `
            <fast-design-system-provider use-defaults>
                ${Story()}
            </fast-design-system-provider>
        `,
    ],
};

export const ListboxOption = (): string => Examples;
