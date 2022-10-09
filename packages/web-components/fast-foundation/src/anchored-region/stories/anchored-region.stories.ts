import { html } from "@microsoft/fast-element";
import { uniqueId } from "@microsoft/fast-web-utilities";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAnchoredRegion } from "../anchored-region.js";
import {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "../anchored-region.options.js";

const storyTemplate = html<StoryArgs<FASTAnchoredRegion>>`
        <fast-anchored-region
            class="region"
            ?use-point-anchor="${x => x.usePointAnchor}"
            :pointAnchorX="${x => x.pointAnchorX}"
            :pointAnchorY="${x => x.pointAnchorY}"
            ?horizontal-inset="${x => x.horizontalInset}"
            ?horizontal-viewport-lock="${x => x.horizontalViewportLock}"
            ?vertical-inset="${x => x.verticalInset}"
            ?vertical-viewport-lock="${x => x.verticalViewportLock}"
            anchor="${x => x.anchor}"
            auto-update-mode="${x => x.autoUpdateMode}"
            fixed-placement="${x => x.fixedPlacement}"
            horizontal-default-position="${x => x.horizontalDefaultPosition}"
            horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
            horizontal-scaling="${x => x.horizontalScaling}"
            horizontal-threshold="${x => x.horizontalThreshold}"
            vertical-default-position="${x => x.verticalDefaultPosition}"
            vertical-positioning-mode="${x => x.verticalPositioningMode}"
            vertical-scaling="${x => x.verticalScaling}"
            vertical-threshold="${x => x.verticalThreshold}"
            viewport="${x => x.viewport}"
        >
            ${x => x.storyContent}
        </fast-anchored-region>
    </div>
`;

export default {
    title: "Anchored Region",
    args: {
        storyContent: html`
            <div
                id="content"
                style="background:rgba(0, 255, 0, 0.2); height:100%; width:100%;"
            >
                <div style="background: var(--neutral-fill-rest); padding: 10px">
                    anchored region
                </div>
            </div>
        `,
        autoUpdateMode: "auto",
        fixedPlacement: false,
        horizontalInset: false,
        horizontalViewportLock: false,
        verticalInset: false,
        verticalViewportLock: false,
        horizontalPositioningMode: "dynamic",
        verticalPositioningMode: "dynamic",
    },
    argTypes: {
        anchor: { control: "text" },
        anchorId: { table: { disable: true } },
        autoUpdateMode: {
            control: "select",
            options: Object.values(AutoUpdateMode),
        },
        usePointAnchor: { control: "boolean" },
        pointAnchorX: { control: "number" },
        pointAnchorY: { control: "number" },
        pointerTracking: { control: "boolean" },
        fixedPlacement: { control: "boolean" },
        horizontalDefaultPosition: {
            control: "select",
            options: Object.values(HorizontalPosition),
        },
        horizontalInset: { control: "boolean" },
        horizontalPositioningMode: {
            control: "select",
            options: Object.values(AxisPositioningMode),
        },
        horizontalScaling: {
            control: "select",
            options: Object.values(AxisScalingMode),
        },
        horizontalThreshold: { control: "number" },
        horizontalViewportLock: { control: "boolean" },
        storyContent: { table: { disable: true } },
        verticalDefaultPosition: {
            control: "select",
            options: Object.values(VerticalPosition),
        },
        verticalInset: { control: "boolean" },
        verticalPositioningMode: {
            control: "select",
            options: Object.values(AxisPositioningMode),
        },
        verticalScaling: {
            control: "select",
            options: Object.values(AxisScalingMode),
        },
        verticalThreshold: { control: "number" },
        verticalViewportLock: { control: "boolean" },
        viewport: { control: "text" },
    },
    decorators: [
        (Story, { args }) => {
            // IDs are generated to ensure that they're unique for the docs page
            const renderedStory = Story() as DocumentFragment;
            const anchor = renderedStory.querySelector(".anchor") as HTMLElement;
            const region = renderedStory.querySelector(".region") as HTMLElement;

            if (anchor) {
                const anchorId = args.anchorId ?? uniqueId("anchor");
                anchor.id = anchorId;
                region.setAttribute("anchor", anchorId);
            }

            region.id = uniqueId("region");

            const subRegions = renderedStory.querySelectorAll(".subregion");
            subRegions.forEach(element => {
                element.setAttribute("anchor", region.id);
            });

            return renderedStory;
        },
    ],
} as Meta<FASTAnchoredRegion>;

export const AnchoredRegion: Story<FASTAnchoredRegion> = renderComponent(
    html<StoryArgs<FASTAnchoredRegion>>`
        <div style="min-height: 100px">
            <fast-button class="anchor" style="margin: 250px;">Anchor</fast-button>
            ${storyTemplate}
        </div>
    `
).bind({});
AnchoredRegion.args = {};

export const PointAnchor: Story<FASTAnchoredRegion> = renderComponent(
    html<StoryArgs<FASTAnchoredRegion>>`
        <div style="min-height: 100px">
            ${storyTemplate}
        </div>
    `
).bind({});
PointAnchor.args = {
    usePointAnchor: true,
    pointAnchorX: 200,
    pointAnchorY: 200,
};

export const PositionsBase: Story<FASTAnchoredRegion> = renderComponent(
    html<StoryArgs<FASTAnchoredRegion>>`
        <div style="min-height: 100px">
            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="left"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="top"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: green; opacity:0.5; padding: 10px;">
                    top-left
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="right"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="top"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: green; opacity:0.5; padding: 10px;">
                    top-right
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="left"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="bottom"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: green; opacity:0.5; padding: 10px;">
                    bottom-left
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="right"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="bottom"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: green; opacity:0.5; padding: 10px;">
                    bottom-right
                </fast-card>
            </fast-anchored-region>
            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="right"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="center"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="anchor"
            >
                <fast-card style="background: blue; opacity:0.5; padding: 10px;">
                    center-right
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="left"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="fill"
                vertical-default-position="center"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="anchor"
            >
                <fast-card style="background: blue; opacity:0.5; padding: 10px;">
                    center-left
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="center"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="anchor"
                vertical-default-position="top"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: blue; opacity:0.5; padding: 10px;">
                    top-center
                </fast-card>
            </fast-anchored-region>

            <fast-anchored-region
                class="subregion"
                fixed-placement="true"
                auto-update-mode="auto"
                horizontal-default-position="center"
                horizontal-positioning-mode="locktodefault"
                horizontal-scaling="anchor"
                vertical-default-position="bottom"
                vertical-positioning-mode="locktodefault"
                vertical-scaling="fill"
            >
                <fast-card style="background: blue; opacity:0.5; padding: 10px;">
                    bottom-center
                </fast-card>
            </fast-anchored-region>

            ${storyTemplate}
        </div>
    `
).bind({});
PositionsBase.args = {
    storyContent: html`
        <div
            id="content"
            style="background:rgba(0, 255, 0, 0.2); height:100%; width:100%;"
        >
            <div style="background: var(--neutral-fill-rest); padding: 10px">
                anchored region
            </div>
            <fast-tooltip track-pointer="true" anchor="content">
                The main anchored region
                <br />
                is also the anchor for
                <br />
                the colored sub-regions.
            </fast-tooltip>
        </div>
    `,
    usePointAnchor: true,
    pointAnchorX: 200,
    pointAnchorY: 200,
};
