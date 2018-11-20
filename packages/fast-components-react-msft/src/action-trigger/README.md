# Action trigger
*Action trigger* performs an operation that is positioned inline on the page. Use *action trigger* for taking an action or for interacting with something like a file or media resource. Examples include “Save,” “Edit,” or “Play.” Using an *action trigger* keeps the user within the current context rather than forcing them to navigate to a different page. Thus, use an *action trigger* as part of an interactive in-page experience.  *Action trigger* is built using a host element such as a button or an anchor, and can also be used in a group of elements. Typically, *action triggers* are used inside interactive tables or related to other interactive content. This means that the trigger should be co-located with the positioning of the material it will be acting upon. There is no provision for displaying alternate labels to indicate a change of state — use the action toggle if you need this capability.

## Usage
Use *action trigger* to take an action in the middle of a workflow. For example, to play an album before buying it. Use a glyph and/or text label so the user can visually identify the *action trigger*. When using a glyph label only, add a tooltip to the *action trigger* so that there is a secondary means for identifying the function of the *action trigger*.

## Style guidance
Position the *action trigger* so that it is in close proximity to the item it will be acting upon, and where it is easy for the user to identify this association. 

## Accessibility
If more verbose language is needed to fully capture the *action trigger* meaning for assistive technologies, an unhandled prop `aria-label` may be used to provide more context.