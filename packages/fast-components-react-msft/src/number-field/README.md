# Number field

A *number field* is an input element of `type=number` that allows users to input and edit numerical data.

## Usage

As an `<input>` element of `type=number`, *number field* is used to let the user enter purely numerical values, such as quantity. Inputs of `type=number` include built-in validation to reject non-numerical entries. *Number field* is not appropriate for all input value that happen to contain numbers, only when increment and decrement are useful operations on the value &mdash; typically, these operations are not useful on numbers used as identifiers (credit card numbers or postal codes). When a number field is not appropriate, use text field instead.

Use attributes such as `min`, `max`, and `step` to control the expected value within *number field*. A complete list of appropriate attributes can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number).