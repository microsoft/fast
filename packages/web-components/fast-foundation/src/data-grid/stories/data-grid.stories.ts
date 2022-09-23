import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { FASTDataGrid, GenerateHeaderOptions } from "../data-grid.js";

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            item1: `value 1-${i}`,
            item2: `value 2-${i}`,
            item3: `value 3-${i}`,
            item4: `value 4-${i}`,
            item5: `value 5-${i}`,
        });
    }
    return newData;
}

const storyTemplate = html<StoryArgs<FASTDataGrid>>`
    <fast-data-grid
        :rowsData="${x => x.rowsData}"
        ?no-tabbing="${x => x.noTabbing}"
        generate-header="${x => x.generateHeader}"
        grid-template-columns="${x => x.gridTemplateColumns}"
    >
        ${x => x.storyContent}
    </fast-data-grid>
`;

export default {
    title: "Data Grid",
    args: {
        noTabbing: false,
        rowsData: newDataSet(50, 1),
    },
    argTypes: {
        generateHeader: {
            control: "select",
            options: Object.values(GenerateHeaderOptions),
        },
        gridTemplateColumns: { control: "text" },
        noTabbing: { control: "boolean" },
        rowsData: { control: "object" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTDataGrid>;

export const DataGrid: Story<FASTDataGrid> = renderComponent(storyTemplate).bind({});
