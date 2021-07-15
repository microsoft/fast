import { AvatarOptions, Avatar as FoundationAvatar } from "@microsoft/fast-foundation";
/**
 * The FAST Avatar Class
 * @public
 *
 */
export declare class Avatar extends FoundationAvatar {
    /**
     * Indicates the Avatar should have an image source
     *
     * @public
     * @remarks
     * HTML Attribute: src
     */
    imgSrc: string;
    /**
     * Indicates the Avatar should have alt text
     *
     * @public
     * @remarks
     * HTML Attribute: alt
     */
    alt: string;
}
/**
 * The FAST Avatar Template for Images
 *  @public
 *
 */
export declare const imgTemplate: import("@microsoft/fast-element").ViewTemplate<
    Avatar,
    any
>;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Avatar} registration for configuring the component with a DesignSystem.
 *  {@link @microsoft/fast-foundation#AvatarTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-avatar\>
 */
export declare const fastAvatar: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        AvatarOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    AvatarOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Badge
 * @public
 */
export declare const avatarStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: AvatarOptions
) => import("@microsoft/fast-element").ElementStyles;
