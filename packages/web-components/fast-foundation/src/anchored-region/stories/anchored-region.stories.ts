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
import type { DraggableAnchor } from "./examples/draggable-anchor.js";
import { ArPositions } from "./examples/ar-position-demo.js";

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
        fixedPlacement: true,
        horizontalViewportLock: false,
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
            const anchor = (renderedStory.querySelector(
                ".anchor"
            ) as any) as DraggableAnchor;
            const region = (renderedStory.querySelector(
                ".region"
            ) as any) as FASTAnchoredRegion;

            const anchorId = args.anchorId ?? uniqueId("anchor");

            if (anchor) {
                anchor.id = anchorId;
                anchor.addEventListener("positionchange", () => {
                    region?.update();
                });

                if (region) {
                    region.id = uniqueId("region");
                    region?.setAttribute("anchor", anchorId);
                }
            }

            return renderedStory;
        },
    ],
} as Meta<FASTAnchoredRegion>;

export const AnchoredRegion: Story<FASTAnchoredRegion> = renderComponent(
    html<StoryArgs<FASTAnchoredRegion>>`
        <div style="min-height: 100px">
            ${storyTemplate}
            <draggable-anchor class="anchor" point-anchor-x="150" point-anchor-Y="150">
                Anchor
                <br />
                Click to Drag
            </draggable-anchor>
        </div>
    `
).bind({});

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
    storyContent: html`
        <div
            id="content"
            style="background:rgba(0, 255, 0, 0.2); height:100%; width:100%;"
        >
            <div style="background: var(--neutral-fill-rest); padding: 10px">
                Position controlled by
                <br />
                point-anchor-x and point-anchor-y
            </div>
        </div>
    `,
};

export const PositionsDemo: Story<FASTAnchoredRegion> = renderComponent(
    html<StoryArgs<FASTAnchoredRegion>>`
        <ar-position-demo :positions="${x => x.Positions}"></ar-position-demo>
    `
).bind({});
PositionsDemo.parameters = { controls: { include: ["Positions"] } };
PositionsDemo.argTypes = {
    Positions: {
        control: "select",
        options: Object.values(ArPositions),
    },
};
PositionsDemo.args = {
    Positions: "fillLocked",
};
