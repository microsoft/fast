import { css, DOM, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { DatePicker, datePickerTemplate as template } from "./index";

const styles = css``;

const FASTDatePicker = DatePicker.compose({
    baseName: "date-picker",
    template,
    styles
});

describe("DatePicker", () => {

});
