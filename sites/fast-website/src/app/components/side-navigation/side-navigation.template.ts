import { html, repeat, when } from "@microsoft/fast-element";
import { SideNavigation } from "./side-navigation";

export const SideNavigationTemplate = html<SideNavigation>`
    <ul>
        ${when(
            x => x.category === "links",
            html<SideNavigation>`
                ${repeat(
                    x => x.socialData,
                    html`
                        <li>
                            <fast-anchor
                                href=${x => x.actionLink}
                                appearance="lightweight"
                                :innerHTML=${x => x.icon}
                                aria-label=${x => x.actionText}
                            ></fast-anchor>
                        </li>
                    `
                )}
            `
        )}
        ${when(
            x => x.category === "scroll",
            html<SideNavigation>`
                ${repeat(
                    x => x.sectionArray,
                    html`
                        <li>
                            <div
                                class="scroll-indicator ${(x, c) =>
                                    c.parent.sectionArray[c.index].id ===
                                    c.parent.currentSection
                                        ? "scroll-indicator-active"
                                        : ""}"
                            ></div>
                        </li>
                    `,
                    { positioning: true }
                )}
            `
        )}
    </ul>
`;
