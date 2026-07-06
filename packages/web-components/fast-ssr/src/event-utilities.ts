export function shouldBubble(event: Event) {
    return event.bubbles && !event.cancelBubble;
}
