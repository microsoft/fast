import { html, when } from "@microsoft/fast-element";
import { Skeleton } from "./skeleton";

export const SkeletonTemplate = html<Skeleton>`
    <template
        class="${x => (x.shape === "circle" ? "circle" : "rect")}"
        pattern="${x => x.pattern}"
        ?shimmer="${x => x.shimmer}"
    >
        ${when(
            x => x.shimmer === true,
            html`
                <span class="shimmer"></span>
            `
        )}
        <object type="image/svg+xml" data="${x => x.pattern}">
            <img class="pattern" src="${x => x.pattern}" />
        </object>
        <slot></slot>
    </template>
`;
