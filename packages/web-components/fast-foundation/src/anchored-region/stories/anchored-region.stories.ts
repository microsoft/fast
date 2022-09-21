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
    <div style="min-height: 100px">
        <fast-button class="anchor" style="margin: 250px;">Anchor</fast-button>
        <fast-anchored-region
            class="region"
            ?use-point-anchor="${x => x.usePointAnchor}"
            ?mouse-tracking="${x => x.mouseTracking}"
            point-anchor-x="${x => x.pointAnchorX}"
            point-anchor-y="${x => x.pointAnchorY}"
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
        mouseTracking: { control: "boolean" },
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

            const anchorId = args.anchorId ?? uniqueId("anchor");

            anchor.id = anchorId;
            region.id = uniqueId("region");
            region.setAttribute("anchor", anchorId);
            return renderedStory;
        },
    ],
} as Meta<FASTAnchoredRegion>;

export const AnchoredRegion: Story<FASTAnchoredRegion> = renderComponent(
    storyTemplate
).bind({});

export const LockToDefault: Story<FASTAnchoredRegion> = AnchoredRegion.bind({});
LockToDefault.args = {
    horizontalDefaultPosition: HorizontalPosition.right,
    horizontalPositioningMode: AxisPositioningMode.locktodefault,
    verticalDefaultPosition: VerticalPosition.bottom,
    verticalPositioningMode: AxisPositioningMode.locktodefault,
};

export const PointAnchor: Story<FASTAnchoredRegion> = AnchoredRegion.bind({});
PointAnchor.args = {
    usePointAnchor: true,
    pointAnchorX: 200,
    pointAnchorY: 200,
};

export const MouseTracking: Story<FASTAnchoredRegion> = AnchoredRegion.bind({});
MouseTracking.args = {
    usePointAnchor: true,
    pointAnchorX: 200,
    pointAnchorY: 200,
    mouseTracking: true,
};
