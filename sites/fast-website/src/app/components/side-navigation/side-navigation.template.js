import { html, repeat, when } from "@microsoft/fast-element";
export const SideNavigationTemplate = html`
    ${when(
        x => x.category === "links",
        html`
            <ul class="item-list">
                ${repeat(
                    x => x.socialData,
                    html`
                        <li class="list-item">
                            <fast-anchor
                                href=${x => x.actionLink}
                                appearance="lightweight"
                                aria-label=${x => x.actionText}
                            >
                                <span slot="start" :innerHTML=${x => x.icon}></span>
                            </fast-anchor>
                        </li>
                    `
                )}
            </ul>
        `
    )}
    ${when(
        x => x.category === "scroll",
        html`
            <div class="item-list">
                ${repeat(
                    x => x.sectionArray,
                    html`
                        <div
                            class="list-item scroll-indicator ${(x, c) =>
                                c.parent.sectionArray[c.index].id ===
                                c.parent.currentSection
                                    ? "scroll-indicator-active"
                                    : ""}"
                        ></div>
                    `,
                    { positioning: true }
                )}
            </div>
        `
    )}
`;
