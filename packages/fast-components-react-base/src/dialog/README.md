# Dialog
The *dialog* component accepts children and can either be a modal, or a non-modal *dialog*. Modal *dialogs* prevent users from interacting with the rest of the page content, while non-modal *dialogs* allow users the ability to continue interacting with the page. The width and height of the *dialog* content area can be set by props, or if no props are passed, height and width will be set to default values.

Modal dialogs actively force focus to the first focusable child of the dialog wheneven it detects focus in the root document that is not within the dialog itself.  

Modal *dialogs* also manage keyboard focus by listening to keydown events.  Any time the Tab key is pressed when the focus is on the last element in the *dialog*'s tab focus will automatically be moved to the first item in the tab order.  Conversely, any time Shift+Tab is pressed while focus is on the first item in the tab order focus will be moved to the last item in the tab order.  Authors wishing to override this behavior can mark keydown events with "preventDefault()". 

## Accessibility
Learn more about *dialog* accessibility at [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role) and [W3C WAI-ARIA documentation](https://www.w3.org/TR/wai-aria-practices/#dialog_modal).