import { attr, FastElement } from "@microsoft/fast-element";
import { designSystemConsumer } from "../design-system-provider/design-system-consumer";
import { neutralfillrest } from "../styles/recipes";

@designSystemConsumer({
    recipes: [neutralfillrest],
})
export class NameTag extends FastElement {
    @attr
    public greeting: string = "Hello";
}
