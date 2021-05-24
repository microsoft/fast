# Abstract
This spec outlines the functionality of the inline editing layer for use with the `HTMLRender` web component.

## Overview
This component will derive from the `HTMLRenderLayer` class and when placed in a `HTMLRender` component will allow
for inline editing of text. 

## Interaction
Inline text editing will be initiated when the user double-clicks on a text node. When this happens the `HTMLRenderLayerInlineEdit`
control will create a `textarea` and attempt to match the size, position and style so that the `textarea` input is "invisible" against
the background element with the exception of a thin border so that to the user it appears that they are typing directly into the container 
element. The text area will resize as the user types to match how the new text will be rendered (i.e. if the text would result in more or fewer lines)
but will have a minimum size of one line in the case that all text is removed or if the target element did not already have any text.  
While the user is typing within this area keyboard/mouse interactions will work normally (letters, numbers, special characters, 
arrow key navigation, mouse click curser placement, highlighting, copy/paste etc.) with the exceptions of Tab, Enter and Esc. Tab and Enter 
will perform a confirmation action which will remove the `textarea`, replace the text node with the new text and transmit a data message
announcing the update. The Esc key will cancel the text edit, removing the `textarea` and restoring the text node to the original value.

## Implementation
When the `HTMLRender` component detects a `dblclick` event it determine if the even occured on a text node and walk up the `composedPath` 
until it finds the containing element. It will then send a `ActivityType.DoubleClick` alert to all of the child layers. 
The `HTMLRenderLayerInlineEdit` layer will respond to this alert by finding the position and styles (background color, font color, size, family etc)
and will create a `textarea` input element with the same styles placed directly over the target location. It will also save a backup of the 
text content in case the edit is canceled. As the users types within the `textarea` the text node "hidden" behind it will also be updated. As the 
text reflows the `textarea` size and position will be updated so that the user can see the results as they type. The `textarea` will always have 
at least one row if all text is removed or if the target element did not have any text to begin with. 
When the user is done, any event that causes the `textarea` to lose focus to include typing Tab or Enter, or clicking outside of the `textarea`
will be considered a confirmation. The target text node's contents will be replaced with the contents of the `textarea` and the `textarea` input 
will be removed. The Data Dictionary will be updated with the new content and a `data` message will be sent via the `MessageSystem`.
If the Esc key is typed instead then the target text node's content will be restored to its original value and the `textarea` input will be 
removed. 

## Out of scope
Inline editing is not intended to be a full function text editing / formating experience (at this time) and will only allow for simple text 
input. It is also not meant to be an HTML editor and any markup typed into the inline editor will be escaped so it appears as text. Markup
editing can be accomplished in the Monaco editor.