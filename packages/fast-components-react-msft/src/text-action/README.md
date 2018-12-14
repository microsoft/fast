# Text action
The *text action* component allows the user to apply an action to a specific text entry. For instance, typing in an email address and then adding that to a list of other addresses. The preceeding or trailing glyph informs the user what the expected action will be.

## Usage
It is recommended to have some sort of hint text inside and/or label above your *text action* to indicate what kind of text input the user should type. Glyphs and buttons can render either before or after the input field, but cannot share a poisition (i.e. preceding glyph and button). Buttons take precedence over glyphs.

## Behavioral guidance
Avoid relying on *text action* for many text entries. It’s best used for applying actions to a few text entries.
