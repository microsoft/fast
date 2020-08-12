import { attr, FASTElement } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { ARIAGlobalStatesAndProperties } from "../patterns";

/**
 * the position types of flyout in reference to its anchor element.
 */
export enum FlyoutPosition {
    topCentered = "topCentered",
    rightCentered = "rightCentered",
    bottomCentered = "bottomCentered",
    leftCentered = "leftCentered",
    topLeftCorner = "topLeftCorner",
    topRightCorner = "topRightCorner",
    bottomRightCorner = "bottomRightCorner",
    bottomLeftCorner = "bottomLeftCorner",
    topLeftAligned = "topLeftAligned",
    rightTopAligned = "rightTopAligned",
    bottomLeftAligned = "bottomLeftAligned",
    leftTopAligned = "leftTopAligned",
}

/**
 * A Flyout Custom HTML Element.
 *
 * @public
 */
export class Flyout extends FASTElement {
    /**
     * The id of the HTMLElement flyout will be anchored to.
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public anchor: string;
    private anchorChanged() {
        // TODO: NEEDED?
    }

    /**
     * Whether or not the flyout can be dismissed by clicking outside of the flyout or pressing the `esc` key.
     *
     * @public
     * @remarks
     * HTML Attribute: light-dismiss
     * @defaultValue false
     */
    @attr({ attribute: "light-dismiss", mode: "boolean" })
    public lightDismiss: boolean = false;

    /**
     * Whether or not an overlay that dims the out of scope UI is drawn until the flyout is dismissed.
     *
     * @public
     * @remarks
     * HTML Attribute: overlay
     * @defaultValue false
     */
    @attr({ mode: "boolean" })
    public overlay: boolean = false;

    /**
     * The position of the flyout in reference to its anchor element.
     *
     * @public
     * @remarks
     * HTML Attribute: position
     * @defaultValue top-centered
     */
    @attr
    public position: FlyoutPosition = FlyoutPosition.topCentered;

    /**
     * Whether or not the flyout's position is responsive in reference to the available space of the chosen position. If the chosen position does not have enough space to fit the content of the flyout the anchored region will dynamically find a location that has enough space when `responsive` is true.
     *
     * @public
     * @remarks
     * HTML Attribute: responsive
     * @defaultValue true
     */
    @attr({ mode: "boolean" })
    public responsive: boolean = true;

    /**
     * Whether or not the flyout is visible. Controlled by the author
     *
     * @public
     * @remarks
     * HTML Attribute: visible
     * @defaultValue undefined
     */
    @attr({ mode: "fromView" })
    public visible: boolean;

    @attr({ attribute: "horizontal-default-position" })
    public horizontalDefaultPosition;
    @attr({ attribute: "horizontal-inset" })
    public horizontalInset;
    @attr({ attribute: "horizontal-scaling" })
    public horizontalScaling;
    @attr({ attribute: "vertical-default-position" })
    public verticalDefaultPosition;
    @attr({ attribute: "vertical-inset" })
    public verticalInset;
    @attr({ attribute: "vertical-scaling" })
    public verticalScaling;

    /**
     * @internal
     */
    public isNonFocusableContent = () => {
        // TODO: check if slotted content is nodeType 3 (elements?)
    };
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface Flyout extends ARIAGlobalStatesAndProperties {}
applyMixins(Flyout, ARIAGlobalStatesAndProperties);
