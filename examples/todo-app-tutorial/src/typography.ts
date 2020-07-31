import { css } from '@microsoft/fast-element';

export const typography = css`
  h1, h2, h3, h4, h5, h6 {
    margin: 0px;
  }
  
  h1 {
    font-size: var(--type-ramp-plus-5-font-size);
    line-height: var(--type-ramp-plus-5-line-height);
  }

  h4 {
    font-size: var(--type-ramp-plus-2-font-size);
    line-height: var(--type-ramp-plus-2-line-height);
  }

  .list-text {
    font-size: var(--type-ramp-plus-2-font-size);
    line-height: var(--type-ramp-plus-2-line-height);
  }
`;