import { html, ref, when } from "@microsoft/fast-element";
import { UnityHost } from "./unity-host";

export const UnityHostTemplate = html<UnityHost>`
    <template ${ref("hostElement")} style="${x => x.hostStyle}">
        <slot></slot>
    </template>
`;
