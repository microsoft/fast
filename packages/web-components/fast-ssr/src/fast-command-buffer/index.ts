const FASTCommandBufferAttributeName: string = "data-fast-buffer-events";

interface CommandCache {
    originalNode: HTMLElement;
    event: Event;
    attachedNode: HTMLElement | null;
}

/**
 * Component for recording user events on SSR rendered FAST components which have not yet hydrated and replaying those
 * events when they have.
 * During SSR an instance of the <fast-command-buffer/> component should be placed as a direct child within every template
 * that contains children with behaviors bound to user generated events (click, mouseover, focus, etc). When those child element
 * tags are rendered FASTCommandBufferAttributeName attribute must be included that lists the events which the element needs to
 * have recorded as a comma delimited list (i.e. <button data-fast-buffer-events="click,mousedown,mouseup"/>).
 * Once the page loads the FASTCommandBuffer instances will automatically attach event listeners to the elements with the
 * FASTCommandBufferAttributeName for the events listed and will record any user generated events to a global static cache.
 * During hydration of the components FAST-Element will need to stop event recording by removing the FASTCommandBuffer element from
 * the template or by calling the stopRecording() method. FAST-Element must then identify any elements with behaviors and depending on how the
 * hydration occurs either map the old element to a new replacing element or confirm to the FASTCommandCache that the element is
 * the same by calling the FASTCommandBuffer.attachElementToEvents() static method. Once all elements that have recorded events are
 * matched up then they will be automatically replayed.
 */
class FASTCommandBuffer extends HTMLElement {
    // Global static cache of recorded events
    private static globalCommandCache: CommandCache[] = [];

    /**
     * During hydration the original elements with recordable events must be matched up to
     * the new element, in the case the template is replaced, or simply to the same element
     * when not being replaced. The hydration process should call this method passing the
     * original element instance along with the element that is replacing it. All recorded
     * events will be automatically replayed once all recorded events have had elements
     * attached.
     * @param origNode The original element that recorded events.
     * @param attachNode The new element replacing it or the same element.
     */
    public static attachElementToEvents(origNode: HTMLElement, attachNode: HTMLElement) {
        let unattachedNodes: boolean = false;
        // Loop through the command cache matching up the elements.
        FASTCommandBuffer.globalCommandCache.forEach((item: CommandCache) => {
            if (item.originalNode.isSameNode(origNode)) {
                item.attachedNode = attachNode;
            } else if (item.attachedNode === null) {
                unattachedNodes = true;
            }
        });
        // if all recorded events have been matched then replay the events.
        if (!unattachedNodes) {
            FASTCommandBuffer.replayAll();
        }
    }

    // Static method for manually replaying events
    public static replayAll(): void {
        /**
         * Loop through cache, replay the event and remove it from the cache.
         * Loop until we reach the end or there is an event without an attachedNode since there
         * is a chance that more events could be recorded while we are looping.
         */
        while (
            this.globalCommandCache.length > 0 &&
            this.globalCommandCache[0].attachedNode !== null
        ) {
            this.globalCommandCache[0].attachedNode.dispatchEvent(
                this.globalCommandCache[0].event
            );
            this.globalCommandCache.splice(0, 1);
        }
    }

    /**
     * Cache for the Template element containing the FASTCommandCache instance. Needed when removing event recorders
     * during disconnectedCallback.
     */
    private templateRoot: ShadowRoot | undefined;

    /**
     * @internal
     */
    public connectedCallback(): void {
        this.templateRoot = this.parentNode as ShadowRoot;
        this.addEventRecorders();
    }

    public disconnectedCallback(): void {
        // Remove recording event listeners
        this.removeEventRecorders();
    }

    /**
     * Records an event to the globalCommandCache.
     * @param ev The event to be recorded.
     */
    public recordEvent(ev: Event) {
        FASTCommandBuffer.globalCommandCache.push({
            originalNode: ev.currentTarget as HTMLElement,
            event: ev,
            attachedNode: null,
        });
    }

    /**
     * Remove recording event listeners from the template containing this FASTCommandBuffer instance.
     * Events will no longer be recorded within this template after this is called.
     */
    public stopRecording(): void {
        this.removeEventRecorders();
    }

    /**
     * Find all instances of elements with the FASTCommandBufferAttributeName attribute and attach the
     * recording event listeners for the specified events.
     */
    private addEventRecorders() {
        const elements: NodeListOf<Element> = this.templateRoot!.querySelectorAll(
            `[${FASTCommandBufferAttributeName}]`
        );
        elements.forEach((el: Element) => {
            const eventlist: string[] = el
                .getAttribute(FASTCommandBufferAttributeName)!
                .split(",");
            eventlist.forEach((ev: string) => {
                el.addEventListener(ev.trim(), this.recordEvent);
            });
        });
    }

    /**
     * Find all instances of elements with the FASTCommandBufferAttributeName attribute and remove the
     * recording event listeners for the specified events.
     */
    private removeEventRecorders() {
        const elements: NodeListOf<Element> = this.templateRoot!.querySelectorAll(
            `[${FASTCommandBufferAttributeName}]`
        );
        elements.forEach((el: Element) => {
            const eventlist: string[] = el
                .getAttribute(FASTCommandBufferAttributeName)!
                .split(",");
            eventlist.forEach(ev => {
                el.removeEventListener(ev.trim(), this.recordEvent);
            });
        });
    }
}

customElements.define("fast-command-buffer", FASTCommandBuffer);
export { FASTCommandBuffer, FASTCommandBufferAttributeName };
