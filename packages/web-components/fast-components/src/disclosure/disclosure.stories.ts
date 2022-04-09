import { html } from "@microsoft/fast-element";
import { Disclosure } from "@microsoft/fast-foundation";
import { Button } from "../index-rollup.js";
import { renderComponent } from "../storybook-helpers.js";

const componentTemplate = html`
    <fast-disclosure
        title="${x => x.title}"
        ?expanded="${x => x.expanded}"
        id="${x => x.id}"
        appearance="${x => x.appearance}"
    >
        ${x => x.content}
    </fast-disclosure>
`;

export default {
    title: "Disclosure",
    args: {
        title: "More about Flash",
        content: html`
            <span slot="end">⚡</span>
            <div>
                Created by writer Gardner Fox and artist Harry Lampert, the original Flash
                first appeared in Flash Comics #1 (cover date January 1940/release month
                November 1939). Nicknamed the "Scarlet Speedster", all incarnations of the
                Flash possess "super speed", which includes the ability to run, move, and
                think extremely fast, use superhuman reflexes, and seemingly violate
                certain laws of physics.
            </div>
        `,
    },
    decorators: [
        Story => {
            const renderedStory = Story();
            const style = document.createElement("style");
            style.innerHTML = /* css */ `
                fast-disclosure {
                    display: inline-block;
                }
            `;
            renderedStory.prepend(style);
            return renderedStory;
        },
    ],
};

export const Primary = renderComponent(componentTemplate).bind({});

export const WithDefaultExpanded = renderComponent(componentTemplate).bind({});
WithDefaultExpanded.args = {
    expanded: true,
    title: "More about Green Arrow",
    content: `
        Green Arrow is a fictional superhero who appears in comic books published by DC
        Comics. Created by Mort Weisinger and designed by George Papp, he first appeared
        in More Fun Comics #73 in November 1941. His real name is Oliver Jonas Queen, a
        wealthy businessman and owner of Queen Industries who is also a well-known
        celebrity in Star City.
    `,
};

export const WithHelperMethods = renderComponent(componentTemplate).bind({});
WithHelperMethods.args = {
    id: "supergirl",
    title: "Read about Supergirl",
    content: `
        Supergirl is an American superhero television series developed by Ali Adler, Greg
        Berlanti and Andrew Kreisberg that originally aired on CBS and premiered on
        October 26, 2015. It is based on the DC Comics character Supergirl, created by
        Otto Binder and Al Plastino, and stars Melissa Benoist in the title role.
    `,
};
WithHelperMethods.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;
        const disclosure = renderedStory.querySelector("fast-disclosure") as Disclosure;

        const buttonContainer = document.createElement("div");

        const toggleButton = document.createElement("fast-button") as Button;
        toggleButton.appearance = "outline";
        toggleButton.textContent = "Toggle";
        toggleButton.addEventListener("click", () => disclosure.toggle());
        buttonContainer.appendChild(toggleButton);

        const showButton = document.createElement("fast-button") as Button;
        showButton.appearance = "outline";
        showButton.textContent = "Show";
        showButton.addEventListener("click", () => disclosure.show());
        buttonContainer.appendChild(showButton);

        const hideButton = document.createElement("fast-button") as Button;
        hideButton.appearance = "outline";
        hideButton.textContent = "Hide";
        hideButton.addEventListener("click", () => disclosure.hide());
        buttonContainer.appendChild(hideButton);

        renderedStory.appendChild(buttonContainer);

        return renderedStory;
    },
];

export const WithLightweight = renderComponent(componentTemplate).bind({});
WithLightweight.args = {
    appearance: "lightweight",
    content: html`
        <span slot="start">👩🏻‍🦳</span>
        <strong slot="title">Read about White Canary</strong>
        <div>
            Sara Lance, also known by her alter-ego White Canary, is a fictional character
            in The CW's Arrowverse franchise, first introduced in the 2012 pilot episode
            of the television series Arrow, and later starring in Legends of Tomorrow. The
            character is an original character to the television series, created by Greg
            Berlanti, Marc Guggenheim and Andrew Kreisberg, but incorporates character and
            plot elements of the DC Comics character Black Canary. Sara Lance was
            originally portrayed by Jacqueline MacInnes Wood in the pilot episode, and has
            since been continually portrayed by Caity Lotz. Sara initially goes by the
            moniker of The Canary, a translation of her Arabic League of Assassins name
            الطائر الصافر (Ta-er al-Sahfer), which translates to "Whistling Bird". She
            later adopts the code name of White Canary before joining the Legends of
            Tomorrow.
        </div>
    `,
};
