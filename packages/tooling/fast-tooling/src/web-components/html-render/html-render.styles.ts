import { css } from "@microsoft/fast-element";

export const htmlRenderStyles = (context, definition) => css`
    .container {
        width: 100%;
        height: 100%;
        padding: 0;
        box-sizing: border-box;
    }
    .container.interactive {
        padding: 40px;
    }
    .html-render {
        width: 100%;
        height: 100%;
        outline: none;
    }
`;
