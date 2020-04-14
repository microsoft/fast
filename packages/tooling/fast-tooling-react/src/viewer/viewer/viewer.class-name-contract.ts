/**
 * The class name contract for the viewer component
 */
export interface ViewerClassNameContract {
    /**
     * The root of the viewer
     */
    viewer?: string;

    /**
     * The viewer content region
     */
    viewer_contentRegion?: string;

    /**
     * The content region disabled from interaction
     */
    viewer_contentRegion__disabled?: string;

    /**
     * The iframe
     */
    viewer_iframe?: string;

    /**
     * The responsive draggable handles
     */
    handle?: string;

    /**
     * The left handle
     */
    handle__left?: string;

    /**
     * The right handle
     */
    handle__right?: string;

    /**
     * The bottom handle
     */
    handle__bottom?: string;

    /**
     * The bottom left handle
     */
    handle__bottomLeft?: string;

    /**
     * The bottom right handle
     */
    handle__bottomRight?: string;
}
