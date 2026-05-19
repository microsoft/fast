import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: 16px;
        max-width: 480px;
        margin: 0 auto;
        font-family: inherit;
        color: inherit;
    }

    .app {
        background: white;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    header h1 {
        margin: 0 0 4px;
        font-size: 22px;
    }

    .byline {
        margin: 0 0 16px;
        color: #666;
        font-size: 13px;
    }

    code {
        background: #f3f3f3;
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 12px;
    }

    .empty {
        margin: 16px 0 0;
        color: #888;
        font-style: italic;
        text-align: center;
    }
`;
