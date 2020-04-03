import { attr, FastElement } from "@microsoft/fast-element";
import { designSystemConsumer } from "../design-system-consumer";
import { neutralFillRest } from "../styles/recipes";

@designSystemConsumer({
    recipes: [neutralFillRest],
})
export class NameTag extends FastElement {
    @attr
    public greeting: string = "Hello";
}
