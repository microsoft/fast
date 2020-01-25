/**
 * The class name contract for the dialog component
 */
export interface DialogClassNameContract {
    /**
     * The root of the dialog component
     */
    dialog?: string;

    /**
     * The positioning region for the dialog
     */
    dialog_positioningRegion?: string;

    /**
     * The element that overlays the page while the modal is visible
     */
    dialog_modalOverlay?: string;

    /**
     * The dialog content region
     */
    dialog_contentRegion?: string;
}
