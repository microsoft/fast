## Guidance
Use a *checkbox* to select or deselect items in a list. Use a single *checkbox* by itself in a *toggle* scenario (e.g. "remember me" in a login scenario). Use it within a group for multi-select scenarios, where a user chooses one or more items from a group of choices that are NOT mutually exclusive.

## Usage
*Checkboxes* can be grouped in collections where checking/unchecking the collection *checkbox* can facilitate choosing all or none within the collection, while also preserving the ability to check/uncheck sub-choices. When a collection of sub-choices have both checked and unchecked items, the parent *checkbox* needs to display as indeterminate. The indeterminate functionality is beyond the scope of the framework and is the responsibility of the consuming team.

## Accessibility
Valid markup requires *checkbox* to be used inside a form with a submit button.