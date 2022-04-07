{
    "version": 1.1,
    "tags": [
        {
            "name": "fast-disclosure",
            "title": "Disclosure",
            "description": "The FAST disclosure element",
            "attributes": [
                {
                    "name": "expanded",
                    "title": "Expanded",
                    "description": "Determines the visibility of the additional content",
                    "type": "boolean",
                    "default": false,
                    "required": false
                },
                {
                    "name": "title",
                    "title": "Title",
                    "description":
                        "Default slotted content of the button which toggles the visbility of the additional disclosure content",
                    "type": "string",
                    "default": false,
                    "required": false
                },
                {
                    "name": "appearance",
                    "title": "Appearance",
                    "description": "The disclosure's visual treatment",
                    "type": "string",
                    "values": [
                        {
                            "name": "accent"
                        },
                        {
                            "name": "lightweight"
                        }
                    ],
                    "default": "accent",
                    "required": false
                }
            ],
            "slots": [
                {
                    "name": "title",
                    "title": "Title slot",
                    "description":
                        "The content of the button which toggles the visbility of the additional disclosure content"
                },
                {
                    "name": "start",
                    "title": "Start slot",
                    "description":
                        "Contents of the start slot are positioned before the button content"
                },
                {
                    "name": "end",
                    "title": "End slot",
                    "description":
                        "Contents of the end slot are positioned after the button content"
                },
                {
                    "name": "",
                    "title": "Default slot",
                    "description": "The disclosure content"
                }
            ]
        }
    ]
}
