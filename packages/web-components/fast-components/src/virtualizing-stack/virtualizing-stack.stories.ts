import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { VirtualizingStack as FoundationVirtualingStack } from "@microsoft/fast-foundation";
import VirtualizingStackTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        const defaultStack = document.getElementById(
            "default-stack"
        ) as FoundationVirtualingStack;
        defaultStack.items = ["1", "2", "3", "4", "5", "6"];
    }
});

const providerStyles = `fast-design-system-provider {}`;

export default {
    title: "Virtualizing Stack",
    decorators: [
        Story => `
            <style>${providerStyles}</style>
            ${Story()}
        `,
    ],
};

export const VirtualizingStack = () => VirtualizingStackTemplate;
