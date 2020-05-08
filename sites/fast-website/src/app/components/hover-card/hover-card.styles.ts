import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const HoverCardStyles = css`

${display("block")} :host {
    --background-color: #3A3A3A;
    --background-color-hover: rgba(253, 61, 130, 0.15);
    --color: #ddd;
    --color-accent: #FD3D82;
    contain: content;
    color: var(--color);
    background: var(--background-color);
    box-sizing: border-box;
  }

  :host([hidden]) { 
    display: none;
  }

  fast-card {
    --card-width: 410px;
    background: var(--background-color);
    padding: 15px 20px;
    filter: blur(2px);
    box-shadow: none;
    text-align: left;
  }
  
  fast-card:hover {
    background: var(--background-color-hover);
    box-shadow: 0px 40px 60px rgba(80, 25, 46, 0.4);
    border-radius: 3px;
    filter: none;
  }

  fast-card:hover ::slotted(.lightweight) {
    --accent-foreground-rest: var(--color-accent);
    --accent-foreground-hover: var(--color-accent);
    --accent-foreground-active: var(--color-accent);
  }

  ::slotted(.lightweight) {
    --accent-foreground-rest: var(--color);
    --accent-foreground-hover: var(--color);
    --accent-foreground-active: var(--color);
  }

  fast-card:hover .hoverCard_footer__hoverVisible {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hoverCard_footer__hoverVisible {
    display: none;
  }

  .hoverCard_footer__alwaysVisible {
    display: block;
  }

  fast-card:hover .hoverCard_divider {
    display: block;
  } 

  fast-card:hover .hoverCard_icon {
    display: block;
  } 

  .hoverCard_divider, .hoverCard_icon {
    display: none;
  } 
`;