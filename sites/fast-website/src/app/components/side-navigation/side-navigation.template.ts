import { html, repeat, when } from "@microsoft/fast-element";
import { SideNavigation } from "./side-navigation";

export const SideNavigationTemplate = html<SideNavigation>`
    <ul class="scroll-indicator-active-${x => x.currentSection}">
        ${when(
            x => x.position === "left",
            html<SideNavigation>`
                ${repeat(
                    x => x.socialData,
                    html`
                        <li>
                            <fast-anchor
                                href=${x => x.actionLink}
                                appearance="lightweight"
                                :innerHTML=${x => x.icon}
                            ></fast-anchor>
                        </li>
                    `
                )}
            `
        )}
        ${when(
            x => x.position === "right",
            html<SideNavigation>`
                ${repeat(
                    x => x.sectionArray,
                    html`
                        <li>
                            <a href="#section-${(x, c) => c.index}" class="scroll-link">
                                <div
                                    class="scroll-indicator scroll-indicator-${(x, c) =>
                                        c.index}"
                                ></div>
                            </a>
                        </li>
                    `,
                    { positioning: true }
                )}
            `
        )}
    </ul>
`;
