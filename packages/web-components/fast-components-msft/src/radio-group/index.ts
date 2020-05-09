import { customElement } from "@microsoft/fast-element";
// update the below imports once #3091 is merged
import {
    RadioGroup,
    RadioGroupTemplate as template,
} from "@microsoft/fast-components/dist/radio-group";
import { RadioGroupStyles as styles } from "./radio-group.styles";

@customElement({
    name: "msft-radio-group",
    template,
    styles,
})
export class MSFTRadioGroup extends RadioGroup {}
