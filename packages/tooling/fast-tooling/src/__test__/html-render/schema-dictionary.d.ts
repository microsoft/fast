import { ReservedElementMappingKeyword } from "../../data-utilities/types";
declare const _default: {
    div: {
        $id: string;
        id: string;
        type: string;
        title: string;
        mapsToTagName: string;
        properties: {
            foo: {
                title: string;
                type: string;
            };
            bar: {
                title: string;
                type: string;
            };
            Slot: {
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
                mapsToSlot: string;
            };
        };
    };
    span: {
        $id: string;
        id: string;
        type: string;
        mapsToTagName: string;
        properties: {
            Slot: {
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
                mapsToSlot: string;
            };
        };
    };
    text: {
        $id: string;
        id: string;
        type: string;
    };
};
export default _default;
