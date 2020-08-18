import { FASTDesignSystemProvider } from "../design-system-provider";
import DataGridTemplate from "./fixtures/base.html";
import { FASTDataGrid } from "./";

// Prevent tree-shaking
FASTDataGrid;
FASTDesignSystemProvider;

export default {
    title: "Data grid",
};

export const DataGrid = () => DataGridTemplate;
