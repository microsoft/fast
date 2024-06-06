export const TemplateRendererEventTypes = {
    customElementOpen: "custom-element-open",
    customElementClose: "custom-element-close",
    customElementConnecting: "custom-element-connecting",
    customElementConnected: "custom-element-connected",
    customElementShadowOpen: "custom-element-shadow-open",
    customElementShadowClose: "custom-element-shadow-close",
} as const;
export type TemplateRendererEventTypes =
    (typeof TemplateRendererEventTypes)[keyof typeof TemplateRendererEventTypes];

export interface TemplateRendererEvent {
    readonly type: TemplateRendererEventTypes;
    readonly tagName: string;
}

export type TemplateRendererEvents = TemplateRendererEvent;

export class TemplateRendererEvent {
    constructor(
        public readonly type: TemplateRendererEventTypes,
        public readonly tagName: string
    ) {}
}
