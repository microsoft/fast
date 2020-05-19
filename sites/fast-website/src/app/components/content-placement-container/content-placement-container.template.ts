import { html, repeat, when } from "@microsoft/fast-element";
import { ContentPlacementContainer } from "./content-placement-container";
import { CommunityContentPlacementData } from "../../data/community.data";

export const ContentPlacementContainerTemplate = html<ContentPlacementContainer>`
    <div
        class="container ${x =>
            x.section === "framework" ? "framework_container" : ""} ${x =>
            x.section === "community" ? "community_container" : ""}"
    >
        ${when(
            x => x.section === "framework",
            html<ContentPlacementContainer>`
                ${repeat(
                    x => x.frameworkContentPlacementData,
                    html`<site-content-placement
                        class="framework_ContentPlacement ${x => x.name}"
                    >
                        <h3>${x => x.header}</h3>
                        <p slot="body">${x => x.body}</p>
                    </site-content-placement>`
                )}
            `
        )}
        ${when(
            x => x.section === "community",
            html<ContentPlacementContainer>`
                ${repeat(
                    x => x.communityContentPlacementData,
                    html`<site-content-placement icon>
                        <div slot="icon" :innerHTML=${x => x.icon}></div>
                        <h3>${x => x.header}</h3>
                        <p slot="body">${x => x.body}</p>
                        <fast-anchor
                            slot="action"
                            appearance="lightweight"
                            href=${x => x.actionLink}
                            >${x => x.actionText}</fast-anchor
                        >
                    </site-content-placement>`
                )}
            `
        )}
    </div>
`;
