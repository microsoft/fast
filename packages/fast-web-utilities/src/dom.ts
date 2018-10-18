/**
 * Gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events
 * that still use the deprecated keyCode property.
 */
export function getKeyCode(event: KeyboardEvent): number {
    return event === null ? null : event.which || event.keyCode || event.charCode;
}
