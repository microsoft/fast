import { attr, FastElement } from "@microsoft/fast-element";
import { consumer } from "../design-system-provider/design-system-consumer";
import { neutralfillrest } from "../styles/recipes";

@consumer({
    recipes: [neutralfillrest],
})
export class NameTag extends FastElement {
    @attr
    public greeting: string = "Hello";
}
