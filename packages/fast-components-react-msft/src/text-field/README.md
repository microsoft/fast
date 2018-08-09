# Text field 
A *text field* is a form component which allows users to input and edit textual data. Use *text field* when only one line of textual input is required.

## Usage
It is recommended to have some sort of hint text inside and/or *label* above the text fields to indicate what kind of text input the user should type. The framework will style hint text appropriately. When reasonable, automatically set focus to the primary text field or the first text field in a *form*. Limit the length of allowable input text when possible. Since text field input may vary from one use case to another, the length can be limited to a maximum or minimum number of characters. A text field with the **readonly** attribute is focusable and should have **aria-label="Read only"**.

## Style guidance
Make the width of the text fields about a third wider than the longest anticipated input. When stacking many text fields, try to group them together with group headings to make the amount of text fields less overwhelming and more scannable. When applicable, define appropriate input restrictions by using the pattern property to govern what a user is allowed to input in a text field. Pre-fill text fields with known strings when possible. For example, if the user has a profile established on the site, pre-fill the text field for their name when asking the user for their shipping address.