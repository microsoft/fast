/**
 * Select class name contract
 */
export interface FormCategoryClassNameContract {
    formCategory_button: string;
    formCategory_header: string;
    formCategory__collapsed: string;
}

/**
 * Select state interface
 */
export interface FormCategoryProps {
    /**
     * Passes the category title
     * If the title is null, this should not render in a category
     */
    title: string | null;

    /**
     * Is the category expandable
     */
    expandable?: boolean;
}

export interface FormCategoryState {
    expanded?: boolean;
}
