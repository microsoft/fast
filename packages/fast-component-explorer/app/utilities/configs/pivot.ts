import { ComponentViewConfig } from "./data.props";
import { TabsItem } from "@microsoft/fast-components-react-base";
import { Pivot, PivotProps, pivotSchema } from "@microsoft/fast-components-react-msft";
import { groupSchema } from "../../../app/components/group";
import Guidance from "../../.tmp/pivot/guidance";
import API from "../../.tmp/pivot/api";
import { uniqueId } from "lodash-es";

const pivotItem1: TabsItem = {
    tab: {
        id: groupSchema.id,
        props: {
            children: "pivot one",
        },
    } as any,
    content: {
        id: groupSchema.id,
        props: {
            children: "pivot one content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem2: TabsItem = {
    tab: {
        id: groupSchema.id,
        props: {
            children: "pivot two",
        },
    } as any,
    content: {
        id: groupSchema.id,
        props: {
            children: "pivot two content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem3: TabsItem = {
    tab: {
        id: groupSchema.id,
        props: {
            children: "pivot three",
        },
    } as any,
    content: {
        id: groupSchema.id,
        props: {
            children: "pivot three content",
        },
    } as any,
    id: uniqueId(),
};

const pivotItem4: TabsItem = {
    tab: {
        id: groupSchema.id,
        props: {
            children: "pivot four",
        },
    } as any,
    content: {
        id: groupSchema.id,
        props: {
            children: "pivot four content",
        },
    } as any,
    id: uniqueId(),
};

const defaultPivotItems: TabsItem[] = [pivotItem1, pivotItem2, pivotItem3, pivotItem4];

const pivotConfig: ComponentViewConfig<PivotProps> = {
    api: API,
    schema: pivotSchema,
    component: Pivot,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                label: "A set of example text content",
                items: defaultPivotItems,
            },
        },
    ],
};

export default pivotConfig;
