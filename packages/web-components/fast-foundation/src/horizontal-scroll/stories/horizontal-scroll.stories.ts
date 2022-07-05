import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTHorizontalScroll } from "../horizontal-scroll.js";

type HorizontalScrollStoryArgs = Args & FASTHorizontalScroll;
type HorizontalScrollStoryMeta = Meta<HorizontalScrollStoryArgs>;

const componentTemplate = html<HorizontalScrollStoryArgs>`
    <fast-horizontal-scroll>
        ${repeat(
            x => x.items,
            html`
                ${x => x}
            `,
            {
                positioning: true,
            }
        )}
    </fast-horizontal-scroll>
`;

export default {
    title: "Horizontal Scroll",
    args: {
        items: new Array(16).fill(html`
            <fast-card><fast-button>A button</fast-button></fast-card>
        `),
    },
    argTypes: {
        items: { table: { disable: true } },
    },
    decorators: [
        Story => {
            const renderedStory = Story() as FASTHorizontalScroll;

            const styles = document.createElement("style");
            styles.innerHTML = /* css */ `
                fast-card {
                    width: 120px;
                    height: 200px;
                    color: var(--neutral-foreground-rest);
                }

                fast-horizontal-scroll {
                    max-width: 620px;
                    margin: 20px;
                }

                .right-gradient {
                    --scroll-fade-next: var(--fill-color);
                }

                .both-gradient {
                    --scroll-fade-next: var(--fill-color);
                    --scroll-fade-previous: var(--fill-color);
                }

                .top-align {
                    --scroll-align: flex-start;
                }

                .bottom-align {
                    --scroll-align: flex-end;
                }

                .full-width,
                .full-width fast-card {
                    width: 600px;
                    height: 300px;
                }
                .window-resize {
                    max-width: unset;
                }
            `;

            renderedStory.append(styles);

            return renderedStory;
        },
    ],
} as HorizontalScrollStoryMeta;

export const HorizontalScroll = (args: HorizontalScrollStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
