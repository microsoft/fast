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
                            <a
                                href="#${(x, c) => c.parent.sectionArray[c.index].id}"
                                class="scroll-link"
                                @click="${(x, c) => c.parent.clickHandler(c.event, true)}"
                            >
                                <div
                                    @click="${(x, c) =>
                                        c.parent.clickHandler(c.event, false)}"
                                    class="scroll-indicator ${(x, c) =>
                                        c.parent.sectionArray[c.index].id ===
                                        c.parent.currentSection
                                            ? "scroll-indicator-active"
                                            : ""}"
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
