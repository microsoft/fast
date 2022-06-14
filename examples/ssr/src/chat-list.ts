import { css, customElement, FASTElement, html } from "@microsoft/fast-element";

const template = html`
    <slot></slot>
`;
const styles = css``;

@customElement({
    name: "chat-list",
    template,
    styles,
})
export class ChatList extends FASTElement {}
