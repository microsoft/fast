import {
    accentPalette,
    baseLayerLuminance,
    controlCornerRadius,
    disabledOpacity,
    fillColor,
    focusStrokeWidth,
    neutralForegroundRest,
    PaletteRGB,
    strokeWidth,
    SwatchRGB,
} from "@fluentui/web-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";

export function setupFluentUIComponentDesignSystem(
    element: HTMLElement,
    getAllFluentComponentTags: (containingSelector?: string) => string
) {
    element.style.setProperty("background-color", `var(${fillColor.cssCustomProperty})`);
    element.style.setProperty("color", `var(${neutralForegroundRest.cssCustomProperty})`);
    const fontFaceStyle = document.createElement("style");
    fontFaceStyle.innerHTML = `
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Arabic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Arabic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Arabic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Arabic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Arabic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-arabic/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Cyrillic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Cyrillic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Cyrillic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Cyrillic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Cyrillic)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-cyrillic/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (East European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (East European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (East European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (East European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (East European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-easteuropean/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Greek)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Greek)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Greek)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Greek)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Greek)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-greek/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Hebrew)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Hebrew)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Hebrew)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Hebrew)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Hebrew)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-hebrew/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Vietnamese)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Vietnamese)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Vietnamese)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Vietnamese)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (Vietnamese)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-vietnamese/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (West European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-light.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-light.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (West European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semilight.woff) format('woff');
            font-weight: 300;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (West European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-regular.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-regular.woff) format('woff');
            font-weight: 400;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (West European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semibold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-semibold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }
        @font-face {
            font-family: 'Segoe UI Web (West European)';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/segoeui-westeuropean/segoeui-bold.woff) format('woff');
            font-weight: 700;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semilight.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-semilight.woff) format('woff');
            font-weight: 100;
            font-style: normal
        }
        @font-face {
            font-family: 'Leelawadee UI Web';
            src: url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-bold.woff2) format('woff2'),
                 url(https://static2.sharepointonline.com/files/fabric/assets/fonts/leelawadeeui-thai/leelawadeeui-bold.woff) format('woff');
            font-weight: 600;
            font-style: normal
        }`;
    const fontFamilyStyle = document.createElement("style");
    fontFamilyStyle.innerHTML = `
    ${getAllFluentComponentTags()} {
        -moz-osx-font-smoothing:grayscale;
        -webkit-font-smoothing:antialiased;
        font-family: 'Segoe UI Web (West European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif;
    }
    ${getAllFluentComponentTags("[lang^=ar]")} {
        font-family: 'Segoe UI Web (Arabic)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=bg]")} {
        font-family: 'Segoe UI Web (Cyrillic)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=cs]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=el]")} {
        font-family: 'Segoe UI Web (Greek)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=et]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=he]")} {
        font-family: 'Segoe UI Web (Hebrew)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=hi]")} {
        font-family: 'Nirmala UI','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=hr]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=hu]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=ja]")} {
        font-family: 'Yu Gothic UI','Meiryo UI',Meiryo,'MS Pgothic',Osaka,'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=kk]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=ko]")} {
        font-family: 'Malgun Gothic',Gulim,'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=lo]")} {
        font-family: 'Leelawadee UI Web','Lao UI',DokChampa,'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=lt]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=lv]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=pl]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=ru]")} {
        font-family: 'Segoe UI Web (Cyrillic)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=sk]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=sr-latn]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=th]")} {
        font-family: 'Leelawadee UI Web','Kmer UI','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=tr]")} {
        font-family: 'Segoe UI Web (East European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=uk]")} {
        font-family: 'Segoe UI Web (Cyrillic)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=vi]")} {
        font-family: 'Segoe UI Web (Vietnamese)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=zh-hans]")} {
        font-family: 'Microsoft Yahei UI',Verdana,Simsun,'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }
    ${getAllFluentComponentTags("[lang^=zh-hant]")} {
        font-family: 'Microsoft Jhenghei UI',Pmingliu,'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif
    }`;
    element.appendChild(fontFaceStyle);
    element.appendChild(fontFamilyStyle);
}

export function mapFluentUIComponentsDesignSystem(
    element: HTMLElement,
    designSystem: {
        [key: string]: any;
    }
): void {
    Object.entries(designSystem).forEach(([attribute, value]: [string, any]) => {
        switch (attribute) {
            case "fill-color":
                fillColor.setValueFor(element, value);
                break;
            case "base-layer-luminance":
                baseLayerLuminance.setValueFor(element, value);
                break;
            case "accent-base-color": {
                const base = parseColorHexRGB(value);

                if (base) {
                    accentPalette.setValueFor(
                        element,
                        PaletteRGB.create(SwatchRGB.create(base.r, base.g, base.b))
                    );
                }

                break;
            }
            case "control-corner-radius":
                controlCornerRadius.setValueFor(element, value);
                break;
            case "stroke-width":
                strokeWidth.setValueFor(element, value);
                break;
            case "focus-stroke-width":
                focusStrokeWidth.setValueFor(element, value);
                break;
            case "disabled-opacity":
                disabledOpacity.setValueFor(element, value);
                break;
            case "theme":
                baseLayerLuminance.setValueFor(element, value);
                fillColor.setValueFor(element, SwatchRGB.create(value, value, value));
                break;
        }
    });
}
