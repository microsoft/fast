# Number field

A *number field* is an input element of `type=number` that allows users to input and edit numerical data.

## Usage

As an `<input>` element of `type=number`, *number field* is used to let the user enter purely numerical values, such as quantity. Inputs of `type=number` include built-in validation to reject non-numerical entries. The browser provides default stepper arrows (i.e. the up and down arrows found within the input control) to let the user increase and decrease the value using either mouse or keyboard. *Number field* is not appropriate for input that happens to only consist of numbers but isn’t strictly speaking a number. For example, it would be inappropriate for credit card numbers or US postal codes. When a number field is not appropriate, use text field instead.

Use attributes such as `min`, `max`, and `step` to control the expected value within *number field*. A complete list of appropriate attributes can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number).