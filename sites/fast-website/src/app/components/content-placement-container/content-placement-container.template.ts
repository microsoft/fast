import { html, repeat, when } from "@microsoft/fast-element";
import { ContentPlacement } from "../content-placement";
import { ContentPlacementContainer } from "./content-placement-container";

export const ContentPlacementContainerTemplate = html<ContentPlacementContainer>`
    <div class="container">
        ${when(
            x => x.section === "framework",
            html<ContentPlacementContainer>`
                ${repeat(
                    x => x.frameworkContentPlacementData,
                    html`<site-content-placement divider>
                        <h3>${x => x.header}</h3>
                        <p slot="body">${x => x.body}</p>
                        <span slot="compatibility"
                            ><img
                                src=${x => x.compatibilityImageSrc}
                                alt=${x => x.compatibilityImageAlt}
                            />
                            ${x => x.compatibilityText}</span
                        >
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
        ${when(
            x => x.section === "community",
            html<ContentPlacementContainer>`
                ${repeat(
                    x => x.communityContentPlacementData,
                    html`<site-content-placement>
                        <div slot="icon">
                            <img src=${x => x.iconSrc} alt=${x => x.iconAlt} />
                        </div>
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