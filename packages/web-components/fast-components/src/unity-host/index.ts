import { customElement } from "@microsoft/fast-element";
import { UnityHost, UnityHostTemplate as template } from "@microsoft/fast-foundation";
import { UnityHostStyles as styles } from "./unity-host.styles";

/**
 * The FAST Unity Host Ui Element. Implements {@link @microsoft/fast-foundation#UnityHost},
 * {@link @microsoft/fast-foundation#UnityHostTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-unity-host\>
 */
@customElement({
    name: "fast-unity-host",
    template,
    styles,
})
export class FASTUnityHost extends UnityHost {}
