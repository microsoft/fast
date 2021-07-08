const mixin_SegoeUI = (style = 'normal', weight = 'normal') => `
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; 
  font-style: ${style};
  font-weight: ${weight};
`;

export const styles_fontFaces = `
  @font-face {
    font-family: Segoe UI;
    font-weight: 300;
    src: local("Segoe UI Semilight"), local("Segoe UI");
  }

  * {
    ${mixin_SegoeUI()}
  }
`;

export const mixin_cardTitle = mixin_SegoeUI('normal', 'bold');

export const styles_headers = `
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  h1 {
    margin-bottom: 16px;
  }
`;