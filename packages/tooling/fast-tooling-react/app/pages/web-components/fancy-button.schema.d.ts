import { ReservedElementMappingKeyword } from "@microsoft/fast-tooling";
declare const _default: {
    $schema: string;
    title: string;
    mapsToTagName: string;
    description: string;
    type: string;
    id: string;
    properties: {
        children: {
            type: string;
            items: {
                type: string;
                properties: {
                    id: {
                        title: string;
                        type: string;
                    };
                    dataLocation: {
                        title: string;
                        type: string;
                    };
                };
            };
            title: string;
            mapsToSlot: string;
        };
    };
};
export default _default;
