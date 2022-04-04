{
    "version": 1.1,
    "tags": [
        {
            "name": "fast-tooltip",
            "title": "Tooltip",
            "description": "The FAST tooltip element",
            "attributes": [
                {
                    "name": "visible",
                    "title": "Visible",
                    "description": "Sets whether the tooltip is visible or not",
                    "type": "boolean",
                    "required": false
                },
                {
                    "name": "anchor",
                    "title": "Anchor ID",
                    "description":
                        "The HTML ID of the element the tooltip is positioned relative to",
                    "type": "string",
                    "required": false
                },
                {
                    "name": "delay",
                    "title": "Delay",
                    "description":
                        "The delay in milliseconds before a tooltip is shown after a hover event",
                    "type": "number",
                    "default": 300,
                    "required": false
                },
                {
                    "name": "auto-update-mode",
                    "title": "Auto update mode",
                    "description":
                        "Controls when the tooltip updates its position.",
                    "type": "string",
                    "values": [{ "name": "anchor" }, { "name": "auto" }],
                    "default": "anchor",
                    "required": false
                },
                {
                    "name": "position",
                    "title": "Position",
                    "description":
                        "Controls the placement of the tooltip relative to the configured 'Anchor ID'",
                    "values": [
                        { "name": "top" },
                        { "name": "right" },
                        { "name": "bottom" },
                        { "name": "left" },
                        { "name": "start" },
                        { "name": "end" }
                    ],
                    "type": "string",
                    "required,": false
                },
                {
                    "name": "horizontal-viewport-lock",
                    "title": "Horizontal viewport lock",
                    "description": "Controls if the tooltip will always remain fully in the viewport on the horizontal axis",
                    "type": "boolean",
                    "default": false,
                    "required": false
                },
                {
                    "name": "vertical-viewport-lock",
                    "title": "Vertical viewport lock",
                    "description": "Controls if the tooltip will always remain fully in the viewport on the vertical axis",
                    "type": "boolean",
                    "default": false,
                    "required": false
                }
            ],
            "slots": [
                {
                    "name": "",
                    "title": "Default slot",
                    "description": "The tooltip content"
                }
            ]
        }
    ]
}
