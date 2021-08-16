import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { VirtualizingStack as FoundationVirtualizingStack } from "@microsoft/fast-foundation";
import VirtualizingStackTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtualizing-stack")) {
        //scroll stuff into view
        document.querySelectorAll("div[id^=viewport]").forEach((el: HTMLElement) => {
            el.scrollTop = 280;
            RtlScrollConverter.setScrollLeft(
                el,
                el.dir === Direction.rtl ? -250 : 250,
                el.dir === Direction.rtl ? Direction.rtl : Direction.ltr
            );
        });
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
