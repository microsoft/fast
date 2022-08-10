import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTAnchoredRegion } from "../anchored-region.js";

type AnchoredRegionArgs = Args & FASTAnchoredRegion;
type AnchoredRegionMeta = Meta<AnchoredRegionArgs>;

const storyTemplate = html<AnchoredRegionArgs>`
    <div style="height: 300%; width: 300%;">
        <fast-button
            id="anchor"
            class="anchor"
            style="
                    transform: translate(400px, 400px);"
        >
            Anchor
        </fast-button>
        <fast-anchored-region
            class="region"
            id="region"
            anchor="anchor"
            fixed-placement="${x => x.fixedPlacement}"
            vertical-positioning-mode="${x => x.verticalPositioningMode}"
            vertical-default-position="${x => x.verticalDefaultPosition}"
            vertical-inset="${x => x.verticalInset}"
            vertical-scaling="${x => x.verticalScaling}"
            vertical-viewport-lock="${x => x.verticalViewportLock}"
            horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
            horizontal-default-position="${x => x.horizontalDefaultPosition}"
            horizontal-scaling="${x => x.horizontalScaling}"
            horizontal-inset="${x => x.horizontalInset}"
            horizontal-viewport-lock="${x => x.horizontalViewportLock}"
            auto-update-mode="${x => x.autoUpdateMode}"
        >
            ${x => x?.content}
        </fast-anchored-region>
    </div>
`;

export default {
    title: "Anchored Region",
    args: {
        autoUpdateMode: "auto",
        verticalPositioningMode: "locktodefault",
        horizontalPositioningMode: "locktodefault",
        verticalDefaultPosition: "top",
        horizontalDefaultPosition: "left",
        content: html`
            <div style="background: white; padding: 20px">
                anchored-region
            </div>
        `,
    },
    argTypes: {
        fixedPlacement: { control: { type: "boolean" } },
        verticalPositioningMode: {
            options: ["uncontrolled", "locktodefault", "dynamic"],
            control: { type: "select" },
        },
        verticalDefaultPosition: {
            options: ["top", "bottom", "center", "unset"],
            control: { type: "select" },
        },
        verticalInset: { control: { type: "boolean" } },
        verticalScaling: {
            options: ["anchor", "fill", "content"],
            control: { type: "select" },
        },
        verticalViewportLock: { control: { type: "boolean" } },
        horizontalPositioningMode: {
            options: ["uncontrolled", "locktodefault", "dynamic"],
            control: { type: "select" },
        },
        horizontalDefaultPosition: {
            options: ["start", "end", "left", "right", "center", "unset"],
            control: { type: "select" },
        },
        horizontalScaling: {
            options: ["anchor", "fill", "content"],
            control: { type: "select" },
        },
        horizontalInset: { control: { type: "boolean" } },
        horizontalViewportLock: { control: { type: "boolean" } },
        autoUpdateMode: {
            options: ["anchor", "auto"],
            control: { type: "select" },
        },
    },
} as AnchoredRegionMeta;

export const AnchoredRegion = (args: AnchoredRegionArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
