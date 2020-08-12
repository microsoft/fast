import { html, when, elements, slotted } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "@microsoft/fast-foundation";
import CloseIcon from "svg/icon-close.svg";
import MenuIcon from "svg/icon-menu.svg";
import { Navigation } from "./navigation";

export const NavigationTemplate = html<Navigation>`
    <template
        class="site-navigation ${x => (x.opened ? "opened" : "")}
        ${x => (x.debounce ? "debounce" : "")}"
        @focusout=${(x, c) => x.handleFocusOut(c.event as FocusEvent)}
    >
        ${startTemplate}
        <fast-button
            class="nav-button"
            part="nav-button"
            appearance="stealth"
            @click="${x => x.toggleOpened()}"
        >
            ${when(
                x => !x.opened,
                html`
                    ${MenuIcon}
                `
            )}
            ${when(
                x => x.opened,
                html`
                    ${CloseIcon}
                `
            )}
        </fast-button>
        <nav class="anchor-wrapper">
            <ul class="nav-list">
                <slot
                    ${slotted({ property: "slottedNavigationItems", filter: elements() })}
                ></slot>
            </ul>
            ${endTemplate}
        </nav>
    </template>
`;
