{
    "version": 1.1,
    "tags": [
        {
            "name": "fast-divider",
            "title": "Divider",
            "description": "The FAST divider element",
            "attributes": [
                {
                    "name": "role",
                    "title": "Role",
                    "type": "string",
                    "description": "The ARIA role for the divider",
                    "values": [
                        {
                            "name": "separator"
                        },
                        {
                            "name": "presentation"
                        }
                    ],
                    "default": "separator",
                    "required": false
                },
                {
                    "name": "orientation",
                    "title": "Orientation",
                    "description": "The orientation of the divider",
                    "default": "horizontal",
                    "values": [
                        { "name": "horizontal" },
                        { "name": "vertical" }
                    ],
                    "required": false,
                    "type": "string"
                }
            ],
            "slots": []
        }
    ]
}
